
import { GraphQL } from "apollos/dist/core/graphql";
import { run } from "apollos/dist/core/router/client";
import { routes, client } from "/imports"

console.log("LETS DO THIS");
run(routes, client);
