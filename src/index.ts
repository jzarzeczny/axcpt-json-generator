const path = require("path");
const fs = require("fs");

interface DataShape {
  id: number;
  clue: string;
  probe: string;
  variant: string;
  affectID: string;
  reactive: boolean;
}

interface VariantNumber {
  variant: string;
  number: number;
}
interface VariantsReady {
  lowProactive: DataShape[];
  highProactive: DataShape[];
  lowReactive: DataShape[];
  highReactive: DataShape[];
}

const POSSIBLE_LETTERS: string[] = [
  "B",
  "C",
  "D",
  "G",
  "H",
  "I",
  "J",
  "L",
  "M",
  "N",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "Z",
];

const AFFECT_ID: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

const NUMBERS: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const A: string = "A";
const X: string = "X";
//Variants of experiment
const variants: VariantNumber[] = [
  {
    variant: "AX",
    number: 48,
  },
  {
    variant: "AY",
    number: 12,
  },
  {
    variant: "BX",
    number: 12,
  },
  {
    variant: "BY",
    number: 48,
  },
  {
    variant: "A0",
    number: 12,
  },
  {
    variant: "B0",
    number: 12,
  },
];

function createVariant(
  reactive: boolean = false,
  high: boolean = false
): DataShape[] {
  let variantData: DataShape[] = [];
  let id: number = 1;
  variants.forEach((variant: VariantNumber) => {
    for (let i = 0; i < variant.number; i++) {
      let singleVariant: DataShape = {
        id: 0,
        clue: "",
        probe: "",
        variant: "",
        affectID: "",
        reactive: false,
      };
      singleVariant.id = id;
      id++;
      [singleVariant.clue, singleVariant.probe] = variantSwitch(
        variant.variant
      );
      singleVariant.variant = variant.variant;
      singleVariant.reactive = reactive;
      singleVariant.affectID = high
        ? `${AFFECT_ID[randomElement(AFFECT_ID.length)] + 13}`
        : `${AFFECT_ID[randomElement(AFFECT_ID.length)]}`;
      variantData.push(singleVariant);
    }
  });
  return variantData;
}

const lp = shuffleTheArray(createVariant());
const hp = shuffleTheArray(createVariant(false, true));
const lr = shuffleTheArray(createVariant(true, false));
const hr = shuffleTheArray(createVariant(true, true));

const finalData: VariantsReady = {
  lowProactive: lp,
  highProactive: hp,
  lowReactive: lr,
  highReactive: hr,
};

fs.writeFileSync(
  path.join(__dirname, "../", "/results/data.json"),
  JSON.stringify(finalData)
);

// Helper
function randomElement(arrLength: number): number {
  const index = Math.floor(Math.random() * arrLength);
  return index;
}
function variantSwitch(variant: string): any[] {
  switch (variant) {
    case "AX":
      return ["A", "X"];

    case "AY":
      return ["A", POSSIBLE_LETTERS[randomElement(POSSIBLE_LETTERS.length)]];

    case "BX":
      return [POSSIBLE_LETTERS[randomElement(POSSIBLE_LETTERS.length)], "X"];
    case "BY":
      return [
        POSSIBLE_LETTERS[randomElement(POSSIBLE_LETTERS.length)],
        POSSIBLE_LETTERS[randomElement(POSSIBLE_LETTERS.length)],
      ];
    case "A0":
      return ["A", NUMBERS[randomElement(NUMBERS.length)]];
    case "B0":
      return [
        POSSIBLE_LETTERS[randomElement(POSSIBLE_LETTERS.length)],
        NUMBERS[randomElement(NUMBERS.length)],
      ];
    default:
      return ["A", "A"];
  }
}

function shuffleTheArray(array: DataShape[]) {
  const sortedArray = array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
  return sortedArray;
}
