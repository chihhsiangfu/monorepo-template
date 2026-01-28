import { ORPCError } from "@orpc/server";

export const createProcedure = () => {
  let inputSchema: unknown = null;
  const middlewares: Array<
    (opts: {
      context: unknown;
      next: (opts?: { context: unknown }) => Promise<unknown>;
    }) => Promise<unknown>
  > = [];
  let handlerFn:
    | ((opts: { input: unknown; context: unknown }) => Promise<unknown>)
    | null = null;

  const procedure = {
    input: (schema: unknown) => {
      inputSchema = schema;
      return procedure;
    },
    use: (
      middleware: (opts: {
        context: unknown;
        next: (opts?: { context: unknown }) => Promise<unknown>;
      }) => Promise<unknown>,
    ) => {
      middlewares.push(middleware);
      return procedure;
    },
    handler: (
      fn: (opts: { input: unknown; context: unknown }) => Promise<unknown>,
    ) => {
      handlerFn = fn;
      return async ({
        input,
        context,
      }: {
        input: unknown;
        context: unknown;
      }) => {
        // Validate input and apply defaults if schema exists
        let parsedInput = input;
        if (
          inputSchema &&
          typeof (inputSchema as { parse?: unknown }).parse === "function"
        ) {
          parsedInput = (
            inputSchema as { parse: (input: unknown) => unknown }
          ).parse(input);
        }

        // Run middlewares
        let currentContext = context;
        for (const middleware of middlewares) {
          await middleware({
            context: currentContext,
            next: async (opts?: { context: unknown }) => {
              if (opts?.context) {
                currentContext = opts.context;
              }
              return {};
            },
          });
        }

        // Run handler
        if (handlerFn) {
          return handlerFn({ input: parsedInput, context: currentContext });
        }
        throw new Error("No handler defined");
      };
    },
  };
  return procedure;
};

export const requireAuth = (opts: {
  context: unknown;
  next: (opts?: { context: unknown }) => Promise<unknown>;
}) => {
  const ctx = opts.context as { session?: { user?: unknown } | null };
  if (!ctx.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return opts.next({ context: { session: ctx.session } });
};

export const createOrpcMock = () => ({
  o: createProcedure(),
  publicProcedure: createProcedure(),
  protectedProcedure: createProcedure().use(requireAuth),
});
