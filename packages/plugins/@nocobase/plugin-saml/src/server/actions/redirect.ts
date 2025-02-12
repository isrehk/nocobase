import { Context, Next } from '@nocobase/actions';
import { SAMLAuth } from '../saml-auth';
import { AppSupervisor } from '@nocobase/server';

export const redirect = async (ctx: Context, next: Next) => {
  const { authenticator, __appName: appName } = ctx.action.params || {};
  let prefix = '';
  if (appName && appName !== 'main') {
    const appSupervisor = AppSupervisor.getInstance();
    if (appSupervisor?.runningMode !== 'single') {
      prefix = `/apps/${appName}`;
    }
  }
  const auth = (await ctx.app.authManager.get(authenticator, ctx)) as SAMLAuth;
  try {
    const { token } = await auth.signIn();
    ctx.redirect(`${prefix}/signin?authenticator=${authenticator}&token=${token}`);
  } catch (error) {
    ctx.redirect(`${prefix}/signin?authenticator=${authenticator}&error=${error.message}`);
  }
  await next();
};
