type PurchaseStore = {
    purchases: Record<string, Set<string>>;
};

declare global {
    // Holds demo purchase state across dev-server reloads.
    var courseceanPurchaseStore: PurchaseStore | undefined;
}

const purchaseStore: PurchaseStore = globalThis.courseceanPurchaseStore ?? {
    purchases: {},
};

globalThis.courseceanPurchaseStore = purchaseStore;

export function markPurchased(username: string, courseId: string) {
    if (!purchaseStore.purchases[username]) {
        purchaseStore.purchases[username] = new Set();
    }

    purchaseStore.purchases[username].add(courseId);
}

export function getPurchasedCourseIds(username: string) {
    return Array.from(purchaseStore.purchases[username] ?? []);
}
