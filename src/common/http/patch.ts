interface Patch {
  asGuid: string;
  user: string;
  version: number;
  binaryXml?: number;
  schemaXml?: string;
  binaryYaml?: number;
  schemaYaml?: string;
}

export default Patch;
