type BasicUser = {
  email?: string | null;
};

function parseOwnerEmails() {
  const configured = process.env.OWNER_EMAILS?.trim();
  if (!configured) return null;

  const list = configured
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  return list.length ? new Set(list) : null;
}

export function isOwnerUser(user: BasicUser | null | undefined) {
  if (!user?.email) return false;

  const allowed = parseOwnerEmails();
  // Backward compatible behavior: if OWNER_EMAILS is not set yet,
  // keep existing authenticated-owner flow working.
  if (!allowed) return true;

  return allowed.has(user.email.toLowerCase());
}
