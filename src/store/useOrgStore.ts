import { create } from 'zustand';
import { MOCK_ORGS } from '../mocks/mockProvider';
import type { Organization } from '../types/iot';

interface OrgState {
    currentOrg: Organization;
    isLoading: boolean;
    setOrganization: (orgId: string) => void;
}

// Importing MOCK_ORGS from mockProvider to initialize state
// We need to export MOCK_ORGS from mockProvider first, which I did in the previous step but I need to make sure types are imported correctly.
// Actually MOCK_ORGS is defined in mockProvider.ts.
// Organization is defined in types/iot.ts but I imported it from mockProvider in the import statement above which is wrong.
// I should import Organization from types/iot.ts

export const useOrgStore = create<OrgState>((set) => ({
    currentOrg: MOCK_ORGS[0],
    isLoading: false,
    setOrganization: (orgId: string) => {
        const org = MOCK_ORGS.find((o) => o.id === orgId);
        if (org) {
            set({ isLoading: true });
            // Simulate network request
            setTimeout(() => {
                set({ currentOrg: org, isLoading: false });
            }, 500);
        }
    },
}));
