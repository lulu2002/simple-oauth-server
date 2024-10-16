import RandomCodeGenerator from "@src/application/util/random-code-generator";

export default class RandomCodeGeneratorFixed implements RandomCodeGenerator {

  constructor(public char: string) {
  }

  generate(length: number): string {
    return this.char.repeat(length);
  }

}