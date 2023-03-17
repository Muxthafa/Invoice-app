import { createStore } from "vuex";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import db from "../firebase/firebaseInit";

export default createStore({
  state: {
    invoiceModal: null,
    modalActive: null,
    invoicesLoaded: null,
    invoiceData: [],
    currentInvoiceArray: null,
    editInvoice: null,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.modalActive = !state.modalActive;
    },
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    },
    SET_INVOICE_DATA(state, payload) {
      state.invoiceData.push(payload);
      console.log(state.invoiceData);
    },
    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter(
        (invoice) => invoice.invoiceId === payload
      );
      console.log("hello", state.currentInvoiceArray);
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
    DELETE_INVOICE(state, payload) {
      state.invoiceData = state.invoiceData.filter(
        (invoice) => invoice.docId !== payload
      );
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      });
    },
  },
  actions: {
    async GET_INVOICES({ commit, state }) {
      try {
        const docRef = collection(db, "invoices");
        const docSnap = await getDocs(docRef);
        console.log(docSnap);
        docSnap.forEach((doc) => {
          if (!state.invoiceData.some((invoice) => invoice.docId === doc.id)) {
            const data = {
              docId: doc.id,
              invoiceId: doc.data().invoiceId,
              billerStreetAddress: doc.data().billerStreetAddress,
              billerCity: doc.data().billerCity,
              billerZipCode: doc.data().billerZipCode,
              billerCountry: doc.data().billerCountry,
              clientName: doc.data().clientName,
              clientEmail: doc.data().clientEmail,
              clientStreetAddress: doc.data().clientStreetAddress,
              clientCity: doc.data().clientCity,
              clientZipCode: doc.data().clientZipCode,
              clientCountry: doc.data().clientCountry,
              invoiceDateUnix: doc.data().invoiceDateUnix,
              invoiceDate: doc.data().invoiceDate,
              paymentTerms: doc.data().paymentTerms,
              paymentDueDateUnix: doc.data().paymentDueDateUnix,
              paymentDueDate: doc.data().paymentDueDate,
              productDescription: doc.data().productDescription,
              invoiceItemList: doc.data().invoiceItemList,
              invoiceTotal: doc.data().invoiceTotal,
              invoicePending: doc.data().invoicePending,
              invoiceDraft: doc.data().invoiceDraft,
              invoicePaid: doc.data().invoicePaid,
            };
            commit("SET_INVOICE_DATA", data);
          }
          commit("INVOICES_LOADED");
        });
        commit("INVOICES_LOADED");
      } catch (error) {
        console.log(error);
      }
    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      commit("DELETE_INVOICE", docId);
      await dispatch("GET_INVOICES");
      commit("TOGGLE_INVOICE");
      commit("TOGGLE_EDIT_INVOICE");
      commit("SET_CURRENT_INVOICE", routeId);
    },
    async DELETE_INVOICE({ commit }, docId) {
      const docRef = doc(db, "invoices", docId);
      console.log(docRef);
      await deleteDoc(docRef);
      commit("DELETE_INVOICE", docId);
    },
    async UPDATE_STATUS_TO_PAID({ commit }, docId) {
      const docRef = doc(db, "invoices", docId);
      await updateDoc(docRef, {
        invoicePaid: true,
        invoicePending: false,
      });
      commit("UPDATE_STATUS_TO_PAID", docId);
    },
    async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
      const docRef = doc(db, "invoices", docId);
      await updateDoc(docRef, {
        invoicePaid: false,
        invoicePending: true,
        invoiceDraft: false,
      });
      commit("UPDATE_STATUS_TO_PENDING", docId);
    },
  },
  modules: {},
});
