declare module "yamljs" {
  const yamljs: {
    parse: (content: string) => object;
  };
  export default yamljs;
}
