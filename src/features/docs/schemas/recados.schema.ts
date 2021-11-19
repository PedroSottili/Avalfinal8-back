export const scrapSchema = {
    type: "object",
    properties: {
      uid: {
        type: "string",
        summary: "uid do recado"
      },
      descricao: {
        type: "string",
        summary: "Descrição do recado"
      },
      detalhamento: {
        type: "string",
        summary: "Detalhamento do recado"
      },
      userUID: {
        type: "string",
        summary: "uuid do recado"
      },
      user: {
        $ref: "#/schemas/user",
      },
    },
  };