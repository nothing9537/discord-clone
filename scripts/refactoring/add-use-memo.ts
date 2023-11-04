import { Project, SyntaxKind } from 'ts-morph';

const project = new Project();

project.addSourceFilesAtPaths(['components/**/*.tsx'])

const sourceFiles = project.getSourceFiles().filter((sourceFile) => {
  return !sourceFile.getFilePath().includes('ui');
});

sourceFiles.forEach((sourceFile) => {
  const sourceFileStringLiteralExpression = sourceFile.getFirstDescendantByKind(SyntaxKind.ExpressionStatement)?.getExpression();

  if (sourceFileStringLiteralExpression?.getText()?.slice(1, -1) === 'use client') {
    sourceFile.getImportDeclarations().forEach(importDeclaration => {
      if (importDeclaration.getModuleSpecifierValue() === 'react') {
        const namespaceImport = importDeclaration.getNamespaceImport();
        if (namespaceImport) {
          return;
        }

        const namedImports = importDeclaration.getNamedImports();

        const hasMemo = namedImports.some(namedImport => namedImport.getName() === 'memo');

        if (!hasMemo) {
          importDeclaration.addNamedImport('memo');
        }
      }
    });

    sourceFile.getVariableStatements().forEach((variableStatement) => {
      if (variableStatement.hasExportKeyword()) {
        const declarations = variableStatement.getDeclarations();

        declarations.forEach((declaration) => {
          const initializer = declaration.getInitializer();
          
          if (initializer && initializer.getKindName() === 'ArrowFunction') {

            if (!initializer.getFirstAncestorByKind(SyntaxKind.CallExpression)) {

              const newInitializer = `memo(${initializer.getText()})`;

              initializer.replaceWithText(newInitializer);
            }
          }
        });
      }
    });
  }
});

project.save();
