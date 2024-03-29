const instructions = {
  SET_A: 0,
  PRINT_A: 1,
  IF_A_N_EQ: 2,
  RET: 3,
  DEC_A: 4,
  JMP: 5,
  INC_A: 6,
};

const program = [
  instructions["SET_A"],
  10,
  instructions["PRINT_A"],
  instructions["DEC_A"],
  instructions["IF_A_N_EQ"],
  0,
  instructions["JMP"],
  2,
  instructions["PRINT_A"],
  instructions["INC_A"],
  instructions["IF_A_N_EQ"],
  10,
  instructions["JMP"],
  8,
  instructions["PRINT_A"],
  instructions["RET"],
  0,
];

execute(program);

function execute(program) {
  let cursor = 0;
  let acc = 0;

  const hasArgs = [0, 2, 3, 5];

  while (true) {
    switch (program[cursor]) {
      case 0:
        acc = program[cursor + 1];
        cursor += 2;
        break;
      case 1:
        console.log(acc);
        cursor++;
        break;
      case 2:
        if (acc !== program[cursor + 1]) {
          cursor += 2;
        } else if (hasArgs.includes(program[cursor + 2])) {
          cursor += 4;
        } else {
          cursor += 3;
        }
        break;
      case 3:
        return program[cursor + 1];
      case 4:
        cursor++;
        acc--;
        break;
      case 5:
        cursor = program[cursor + 1];
        break;
      case 6:
        cursor++;
        acc++;
        break;
    }
  }
}

