import { createSlice } from "@reduxjs/toolkit";

const userexplist = createSlice({
    name: "user",
    initialState: {
        // explist was removed from here on purpose: /userdata used to ship
        // the user's *entire* expense history on every login, which every
        // page (Expense table, dashboard, home, report, ledger detail) then
        // filtered client-side. Each of those screens now fetches exactly
        // the slice of data it needs from its own endpoint instead. This
        // slice only holds the small, genuinely global stuff: profile +
        // ledger list.
        ledgerlist: [],
        user: {},
        loading: false,
        error: null,
        profilepic: "",
    },
    reducers: {
        setUserData(state, action) {
            state.ledgerlist = action.payload?.ledger || [];
            state.user = action.payload?.user || {};
            state.profilepic = action.payload?.user?.imgsrc || "";
        },
        userlogout(state, action) {
            localStorage.removeItem("token");
            state.ledgerlist = [];
            state.user = {};
            state.profilepic = "";
        },
        profilepicupdtae(state, action) {
            state.profilepic = action.payload;
        },
        profiledetailupdtae(state, action) {
            if (state.user) {
                state.user.name = action.payload.name;
                state.user.phone = action.payload.phone;
            }
        },
        updateCookieConsentStatus(state, action) {
            if (state.user) {
                if (!state.user.cookieConsent) state.user.cookieConsent = {};
                state.user.cookieConsent.status = action.payload;
                state.user.cookieConsent.consentDate = new Date().toISOString();
            }
        },
    }
});

export const { userlogout, profilepicupdtae, profiledetailupdtae, updateCookieConsentStatus, setUserData } = userexplist.actions;
export default userexplist.reducer;
