interface Patch {
  asGuid: string;
  user: number;
  version: number;
  binaryXml?: number;
  schemaXml?: string;
  binaryYaml?: number;
  schemaYaml?: string;
}

export default Patch;
