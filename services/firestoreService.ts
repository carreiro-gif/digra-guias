import {
  collection,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";

/* =========================
   GUIAS
========================= */

export const saveGuiaFS = async (guia: any) => {
  await setDoc(doc(db, "guias", guia.id), {
    ...guia,
    criadoEm: Timestamp.now(),
  });
};

export const subscribeGuias = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "guias"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(lista);
  });
};

export const deleteGuiaFS = async (id: string) => {
  await deleteDoc(doc(db, "guias", id));
};

// Aliases para compatibilidade
export const salvarGuia = saveGuiaFS;
export const ouvirGuias = subscribeGuias;
export const excluirGuia = deleteGuiaFS;

/* =========================
   ÓRGÃOS
========================= */

export const salvarOrgao = async (orgao: any) => {
  await setDoc(doc(db, "orgaos", orgao.id), orgao);
};

export const ouvirOrgaos = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "orgaos"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(lista);
  });
};

export const excluirOrgao = async (id: string) => {
  await deleteDoc(doc(db, "orgaos", id));
};

/* =========================
   OPERADORES
========================= */

export const salvarOperador = async (operador: any) => {
  await setDoc(doc(db, "operadores", operador.id), operador);
};

export const ouvirOperadores = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "operadores"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(lista);
  });
};

export const excluirOperador = async (id: string) => {
  await deleteDoc(doc(db, "operadores", id));
};

/* =========================
   RESPONSÁVEIS EXTERNOS
========================= */

export const salvarResponsavel = async (resp: any) => {
  await setDoc(doc(db, "externos", resp.id), resp);
};

export const ouvirResponsaveis = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "externos"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(lista);
  });
};

export const excluirResponsavel = async (id: string) => {
  await deleteDoc(doc(db, "externos", id));
};

/* =========================
   SERVIÇOS
========================= */

export const salvarServico = async (servico: any) => {
  await setDoc(doc(db, "servicos", servico.id), servico);
};

export const ouvirServicos = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "servicos"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(lista);
  });
};

export const excluirServico = async (id: string) => {
  await deleteDoc(doc(db, "servicos", id));
};
