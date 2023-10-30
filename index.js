import inquirer from "inquirer";
import chalk from "chalk";
import { thoughtPatterns } from "./thoughtPatterns.js";
const blankCharRegExp = /^[\s\u3000]+$/;

const main = async () => {
  const canUserStart = await confirmUserCanStart();
  if (!canUserStart) {
    console.log(
      "アプリを終了します。心が疲れているときは、無理をせずゆっくり休んでくださいね。",
    );
    return;
  }

  const inputProblem = await askForInputtingProblem();
  const selectedThoughtPatterns = await askForSelectingThoughtPatterns();
  const inputRationalReaction = await askForInputtingRationalReaction();
  displayTripleColumn(
    inputProblem,
    selectedThoughtPatterns,
    inputRationalReaction,
  );
};

const confirmUserCanStart = async () => {
  console.log(
    "おつかれさまです。\nこのアプリでは、認知のゆがみに気づくための「トリプルカラム法」というワークを、コマンドライン上で行うことができます。\nなお、心が疲れているときは、無理をせずに休むことも大切です。Control+C で、アプリをいつでも終了できます。\n",
  );
  const answer = await inquirer.prompt({
    type: "confirm",
    name: "canUserStart",
    message: "このまま続けますか？",
  });
  return answer.canUserStart;
};

const askForInputtingProblem = async () => {
  const answer = await inquirer.prompt({
    type: "input",
    name: "problem",
    message:
      "あなたが抱える悩みと、それを考えたときに湧き上がるネガティブな気持ちを書いてください。\n",
    default:
      "1ヶ月前に勉強を始めたプログラミングが全然うまくいかない。自分はいつもこうなる、何の才能もない。",
    validate(answer) {
      if (blankCharRegExp.test(answer)) {
        return "まとまっていなくてもいいので、つらくない限りで何かを書いてみてください。アプリを終了して休みたい場合は Control+C を入力してください。";
      }

      return true;
    },
  });
  return answer.problem;
};

const askForSelectingThoughtPatterns = async () => {
  console.log(
    "\nこれから、入力した悩みへのネガティブな気持ちに関する認知のゆがみをチェックします。",
  );
  const confirmationAnswer = await inquirer.prompt({
    type: "confirm",
    name: "isListNeeded",
    message: "参照用に、認知のゆがみの説明を表示しますか？",
  });
  if (confirmationAnswer.isListNeeded) {
    displayThoughtPattern();
  }
  const selectionAnswer = await inquirer.prompt({
    type: "checkbox",
    name: "thoughtPatterns",
    message:
      "悩みへのネガティブな気持ちに関して、当てはまると思う認知のゆがみを一つ以上選んでください。\n",
    choices: thoughtPatterns.map((pattern) => `${pattern.id}. ${pattern.name}`),
    pageSize: 10,
    validate(answer) {
      if (answer.length === 0) {
        return "認知のゆがみは一つ以上選んでください。アプリを終了したい場合は Control+C を入力してください。";
      }

      return true;
    },
  });
  return selectionAnswer.thoughtPatterns;
};

const displayThoughtPattern = () => {
  console.log("\n==========================================================");
  console.log(chalk.bold("認知のゆがみリスト\n"));
  thoughtPatterns.forEach((pattern) => {
    console.log(chalk.underline(`${pattern.id}. ${pattern.name}`));
    console.log(pattern.description);
    console.log();
  });
  console.log("==========================================================\n");
};

const askForInputtingRationalReaction = async () => {
  const answer = await inquirer.prompt({
    type: "input",
    name: "rationalReaction",
    message:
      "悩みへのネガティブな気持ちに対する、合理的な反応（自分への擁護）を書いてください。\n",
    default:
      "勉強を始める前はターミナルの開き方も知らなかった。\nつまり、初めてから全く成長していないわけではない。私は「全てか無か」思考におちいっていた。\nまた、「自分はいつもこうなる、何の才能もない」と思ったが、今の悩みはあくまでプログラミングについて。\nつまり、他のことや過去・未来のことまで悪くなったわけではない。これは「拡大解釈（破滅化）」だった。",
    validate(answer) {
      if (blankCharRegExp.test(answer)) {
        return "まとまっていなくてもいいので、つらくない限りで何かを書いてみてください。アプリを終了して休みたい場合は Control+C を入力してください。";
      }

      return true;
    },
  });
  return answer.rationalReaction;
};

const displayTripleColumn = (problem, thoughtPatterns, RationalReaction) => {
  console.log();
  console.log(chalk.bold("おつかれさまでした!今回のワークの全体をまとめます。\n"));
  console.log("==========================================================");
  console.log(chalk.bold("あなたの悩み:\n"));
  console.log(problem);
  console.log("\n==========================================================");
  console.log(chalk.bold("認知のゆがみ:\n"));
  thoughtPatterns.forEach((pattern) => console.log(pattern));
  console.log("\n==========================================================");
  console.log(chalk.bold("合理的な反応:\n"));
  console.log(RationalReaction);
  console.log("\n==========================================================\n");
  console.log(
    "このようなワークを通して自分の認知のゆがみに気づくことは、ネガティブな気持ちにとらわれそうになったときの有効な対策の一つです。",
  );
  console.log("心に無理のない範囲で、日常に取り入れてみてくださいね。");
};

main();
