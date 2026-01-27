import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";

import { db } from "./firebase";

/* =========================
   GUIAS
========================= */

export const salvarGuia = async (guia: any) => {
  await setDoc(doc(db, "guias", guia.id), {
    ...guia,
    criadoEm: Timestamp.now(),
  });
};

export const ouvirGuias = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "guias"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => doc.data());
    callback(lista);
  });
};

export const excluirGuia = async (id: string) => {
  await deleteDoc(doc(db, "guias", id));
};

/* =========================
   ÓRGÃOS
========================= */

export const salvarOrgao = async (orgao: any) => {
  await setDoc(doc(db, "orgaos", orgao.id), orgao);
};

export const ouvirOrgaos = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "orgaos"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => doc.data());
    callback(lista);
  });
};

/* =========================
   OPERADORES
========================= */

export const salvarOperador = async (operador: any) => {
  await setDoc(doc(db, "operadores", operador.id), operador);
};

export const ouvirOperadores = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "operadores"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => doc.data());
    callback(lista);
  });
};

/* =========================
   RESPONSÁVEIS EXTERNOS
========================= */

export const salvarResponsavel = async (resp: any) => {
  await setDoc(doc(db, "externos", resp.id), resp);
};

export const ouvirResponsaveis = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "externos"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => doc.data());
    callback(lista);
  });
};

/* =========================
   SERVIÇOS
========================= */

export const salvarServico = async (servico: any) => {
  await setDoc(doc(db, "servicos", servico.id), servico);
};

export const ouvirServicos = (callback: (dados: any[]) => void) => {
  return onSnapshot(collection(db, "servicos"), (snapshot) => {
    const lista = snapshot.docs.map((doc) => doc.data());
    callback(lista);
  });
};
