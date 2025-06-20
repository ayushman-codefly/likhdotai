import { clsx } from "clsx";
import Cryptr from "cryptr";
import { twMerge } from "tailwind-merge"

const cryptr = new Cryptr('LikhUsersEncryptionKey',{ encoding: 'base64', pbkdf2Iterations: 10000, saltLength: 10 })

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function encrypt(string){
  const encrypted = cryptr.encrypt(string);
  return encrypted;

}

export function decrypt(string){
  const decrypted = cryptr.decrypt(string);
  return decrypted;

}
