import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    console.log("Getting tasks");
    return await ctx.db.query("tasks").collect();
  },
});
