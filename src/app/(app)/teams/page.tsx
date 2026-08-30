// adminqinq/src/app/(app)/teams/page.tsx
import { cotebek } from '@/lib/cotebek';
import { InviteForm } from './InviteForm';
import { RemoveButton } from './RemoveButton';
import { AddTeamMemberForm } from './AddTeamMember';

type MyApp = { appId: string; appName: string; role: string };
type Member = { userId: string; name: string | null; email: string; role: string; status: string };
type Invite = { id: string; email: string; role: string };
type TeamMember = { id: string; name: string; phone: string | null; userId: string | null };

const ROLE_LABEL: Record<string, string> = { OWNER: 'Owner', ADMIN: 'Admin', STAFF: 'Staf' };

export default async function MembersPage() {
  const currentAppRes = await cotebek<{ data: { id: string; name: string } }>('/apps/me');
 const appId = currentAppRes.data.id;

 let membersRes, invitesRes, teamMembersRes;
 try {
   [membersRes, invitesRes, teamMembersRes] = await Promise.all([
     cotebek<{ data: Member[] }>(`/apps/${appId}/members`),
     cotebek<{ data: Invite[] }>(`/apps/${appId}/invites`),
     cotebek<{ data: TeamMember[] }>('/team-members'),
   ]);
 } catch {
   return (
     <div className="p-4">
       <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">Anggota Tim</h1>
       <p className="text-sm text-muted-foreground">Cuma Owner app ini yang bisa kelola anggota tim.</p>
     </div>
   );
 }

  const members = membersRes.data;
  const invites = invitesRes.data;
  const unlinkedMembers = teamMembersRes.data.filter((m) => m.userId === null);

  return (
    <div className="p-4">
      <h1 className="text-xl font-heading font-bold text-foreground tracking-tight">Anggota Tim</h1>

      <InviteForm appId={appId} />
      <AddTeamMemberForm />

      {invites.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Menunggu Login</h2>
          <ul className="space-y-2">
            {invites.map((inv) => (
              <li key={inv.id} className="border border-dashed rounded-lg p-3 flex justify-between items-center text-sm">
                <div>
                  <div className="font-medium">{inv.email}</div>
                  <div className="text-xs text-muted-foreground">{ROLE_LABEL[inv.role] ?? inv.role} · belum pernah login</div>
                </div>
                <span className="text-[10px] bg-warning/10 text-warning px-1.5 py-0.5 rounded">Pending</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-sm font-medium text-muted-foreground mb-2">Anggota Aktif</h2>
        {members.length === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada anggota lain.</p>
        ) : (
          <ul className="space-y-2">
            {members.map((m) => (
              <li key={m.userId} className="border rounded-lg p-3 flex justify-between items-center text-sm">
                <div>
                  <div className="font-medium">{m.name ?? m.email}</div>
                  <div className="text-xs text-muted-foreground">{ROLE_LABEL[m.role] ?? m.role} · {m.status}</div>
                </div>
                {m.role !== 'OWNER' && <RemoveButton appId={appId} userId={m.userId} />}
              </li>
            ))}
          </ul>
        )}
      </div>

      {unlinkedMembers.length > 0 && (
       <div className="mt-4">
         <h2 className="text-sm font-medium text-muted-foreground mb-2">Anggota Tanpa Akun</h2>
         <ul className="space-y-2">
           {unlinkedMembers.map((m) => (
             <li key={m.id} className="border rounded-lg p-3 text-sm">
               <div className="font-medium">{m.name}</div>
               {m.phone && <div className="text-xs text-muted-foreground">{m.phone}</div>}
             </li>
           ))}
         </ul>
       </div>
     )}
    </div>
  );
}