// Lexer

const lex = str => str.split(' ').map(s => s.trim()).filter(s => s.length);

// Parser

const Op = Symbol('op');
const Num = Symbol('num');

const parse = tokens => {

  let c = 0;
  const peek = () => tokens[c];
  const consume = () => tokens[c++];

  const parseNum = () => ({ val: parseInt(consume()), type: Num });

  const parseOp = () => {
    const node = { val: consume(), type: Op, expr: [] };
    while (peek()) node.expr.push(parseExpr());
    return node;
  };

  const parseExpr = () => /\d/.test(peek()) ? parseNum() : parseOp();

  return parseExpr();
};

// Evaluator

const evaluate = ast => {
    const opAcMap = {
      sum: args => args.reduce((a, b) => a + b, 0),
      sub: args => args.reduce((a, b) => a - b),
      div: args => args.reduce((a, b) => a / b),
      mul: args => args.reduce((a, b) => a * b, 1)
    };
  
    if (ast.type === Num) return ast.val;
    return opAcMap[ast.val](ast.expr.map(evaluate));
  };

// Code Generator

const compile = ast => {
    const opMap = { sum: '+', mul: '*', sub: '-', div: '/' };
    const compileNum = ast => ast.val;
    const compileOp = ast => `(${ast.expr.map(compile).join(' ' + opMap[ast.val] + ' ')})`;
    const compile = ast => ast.type === Num ? compileNum(ast) : compileOp(ast);
    return compile(ast);
  };

  const program = 'mul 3 sub 2 sum 1 3 4';

// Interpreter

console.log(evaluate(parse(lex(program))));

// Compiler

console.log(compile(parse(lex(program))));