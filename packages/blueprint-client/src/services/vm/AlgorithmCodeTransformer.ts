import * as tsvfs from "@typescript/vfs";
import ts from "typescript";
import * as babelParser from "@babel/parser";
import babelGenerate from "@babel/generator";
import { match } from "ts-pattern";
import * as t from "@babel/types";
import type { Visualizer } from "@blueprint/visualizer";
import type { RunnerBuildContext } from "~/types/vm/RunnerBuildContext";
import type { Snippet } from "~/entities/snippet/Snippet";
import type { SnippetGroup } from "~/entities/snippet/SnippetGroup";
import { UnresolvedProgramError } from "~/errors/vm/UnresolvedProgramError";
import { UnresolvedSourceFileError } from "~/errors/vm/UnresolvedSourceFileError";
import { SnippetType } from "~/entities/snippet/Snippet";

export class AlgorithmCodeTransformer {
  private static readonly REEVALUATE_VISUALIZERS_GLOBAL_IDENTIFIER = "__BLUEPRINT_INTERNAL__reevaluateVisualizers";
  private static readonly SOURCE_FILE_NAME = "index.ts";
  private static readonly COMPILER_OPTIONS: ts.CompilerOptions = {
    target: ts.ScriptTarget.ES2015,
  };

  public static createWithPhysicalLibs(): AlgorithmCodeTransformer {
    return new AlgorithmCodeTransformer(
      tsvfs.createDefaultMapFromNodeModules(
        AlgorithmCodeTransformer.COMPILER_OPTIONS,
        ts,
      ),
    );
  }

  private static isSnippetVisible(snippetType: SnippetType): boolean {
    return match(snippetType)
      .with(SnippetType.Source, () => true)
      .with(SnippetType.Visualizer, () => false)
      .with(SnippetType.Markdown, () => true)
      .exhaustive();
  }

  private static isExecutableCodeSnippet(snippetType: SnippetType): boolean {
    return match(snippetType)
      .with(SnippetType.Source, () => true)
      .with(SnippetType.Visualizer, () => true)
      .with(SnippetType.Markdown, () => false)
      .exhaustive();
  }

  public constructor(
    private readonly libs: Map<string, string>,
  ) {}

  public transformToBuildContext(snippetGroups: SnippetGroup[]): RunnerBuildContext {
    const unsafeJsSources = snippetGroups.flatMap((snippetGroup) => snippetGroup.children.map((snippet) => {
      if (!AlgorithmCodeTransformer.isExecutableCodeSnippet(snippet.type)) {
        return undefined;
      }

      const system = tsvfs.createSystem(new Map([
        ...this.libs,
        [AlgorithmCodeTransformer.SOURCE_FILE_NAME, snippet.code],
      ]));

      const env = tsvfs.createVirtualTypeScriptEnvironment(
        system,
        [AlgorithmCodeTransformer.SOURCE_FILE_NAME],
        ts,
        AlgorithmCodeTransformer.COMPILER_OPTIONS,
      );

      const program = env.languageService.getProgram();
      if (program === undefined) {
        throw new UnresolvedProgramError();
      }

      const unsafeTsAst = program.getSourceFile(AlgorithmCodeTransformer.SOURCE_FILE_NAME);
      if (unsafeTsAst === undefined) {
        throw new UnresolvedSourceFileError();
      }

      const sourceFileWithVisualizerUpdates = this.embedVisualizerUpdates(
        snippetGroup,
        snippet,
        unsafeTsAst,
      );

      return ts.transpileModule(
        ts.createPrinter().printFile(sourceFileWithVisualizerUpdates),
        {
          fileName: sourceFileWithVisualizerUpdates.fileName,
          compilerOptions: AlgorithmCodeTransformer.COMPILER_OPTIONS,
        },
      );
    }));

    return {
      unsafeJsAstWithVisualizerUpdates: t.program(
        unsafeJsSources
          .filter((unsafeJsSource) => (unsafeJsSource !== undefined))
          .flatMap((unsafeJsSource) => babelParser.parse(unsafeJsSource.outputText).program.body),
        [],
        "script",
      ),
    };
  }

  public transformToExecutableJs(
    unsafeJsAstWithVisualizerUpdates: t.Program,
    visualizerLocalIdentifier: string,
  ): string {
    return babelGenerate(
      t.program(
        [
          this.wrapInIIFE([
            this.createVisualizerUpdateImplementation(visualizerLocalIdentifier),
            ...unsafeJsAstWithVisualizerUpdates.body,
          ]),
        ],
        [t.directive(t.directiveLiteral("use strict"))],
        "script",
      ),
    ).code;
  }

  private embedVisualizerUpdates(
    snippetGroup: SnippetGroup,
    snippet: Snippet,
    unsafeTsAst: ts.SourceFile,
  ): ts.SourceFile {
    const [transformed] = ts.transform(unsafeTsAst, [
      (context) => (rootNode) => {
        const visit = (node: ts.Node): ts.Node | ts.Node[] => {
          if (ts.isStatement(node)) {
            const reevaluateVisualizersNode = context.factory.createExpressionStatement(
              context.factory.createCallExpression(
                context.factory.createIdentifier(AlgorithmCodeTransformer.REEVALUATE_VISUALIZERS_GLOBAL_IDENTIFIER),
                [],
                [
                  context.factory.createStringLiteral(snippetGroup.id),
                  context.factory.createStringLiteral(snippet.id),
                  AlgorithmCodeTransformer.isSnippetVisible(snippet.type)
                    ? context.factory.createTrue()
                    : context.factory.createFalse(),
                  context.factory.createNumericLiteral(node.pos),
                  context.factory.createNumericLiteral(node.end),
                ],
              ),
            );

            return [
              ts.visitEachChild(node, visit, context),
              reevaluateVisualizersNode,
            ];
          }

          return ts.visitEachChild(node, visit, context);
        };

        return ts.visitEachChild(rootNode, visit, context);
      },
    ]).transformed;

    return transformed!;
  }

  private createVisualizerUpdateImplementation(
    visualizerLocalIdentifier: string,
  ): t.VariableDeclaration {
    return t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier(AlgorithmCodeTransformer.REEVALUATE_VISUALIZERS_GLOBAL_IDENTIFIER),
        t.callExpression(
          t.memberExpression(
            t.memberExpression(
              t.identifier(visualizerLocalIdentifier),
              t.identifier("reevaluate" satisfies keyof Visualizer),
            ),
            t.identifier("bind"),
          ),
          [t.identifier(visualizerLocalIdentifier)],
        ),
      ),
    ]);
  }

  private wrapInIIFE(
    body: t.Statement[],
  ): t.ExpressionStatement {
    return t.expressionStatement(
      t.callExpression(
        t.functionExpression(undefined, [], t.blockStatement(body)),
        [],
      ),
    );
  }
}
