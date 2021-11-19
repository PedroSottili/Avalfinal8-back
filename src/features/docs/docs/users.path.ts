export const usersPath = {
    post: {
      tags: ["Users"],
      summary: "Cria um usuário",
      requestBody: {
        description: "todo",
        required: true,
        content: {
          "application/json": {
            schema: {
              $ref: "#/schemas/createUser",
            },
          },
        },
      },
      responses: {
        200: {
          description: "Caso de sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/schemas/user",
              },
            },
          },
        },
      },
    },
    get: {
      tags: ["Users"],
      summary: "Get",
      parameters: [
        {
          name: "username",
          in: "path",
          description: "Busca nome do usuário",
          required: true,
          type: "string",
        },
      ],
      responses: {
        200: {
          description: "Caso de sucesso",
          content: {
            "application/json": {
              schema: {
                $ref: "#/schemas/user",
              },
            },
          },
        },
      },
    }
}   
    



    