export const userSchema = {
    type: "object",
    properties: {
      uid: {
        type: "string",
        summary: "uid do usuário"
      },
      username: {
        type: "string",
        summary: "Nome do usuário"
      },
    },
  };