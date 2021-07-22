import { StorageKey } from '@/config/constants';
import { loadFromStorage, saveToStorage } from '@/utils/StorageUtil';

export default {
  install() {
    const oids = loadFromStorage(StorageKey.BET_OID_KEY, []);
    if (oids.length) {
      saveToStorage(StorageKey.BET_OID_KEY, oids.filter(({ type }) => type !== 'fast'));
    }
    const betlist = loadFromStorage(StorageKey.BET_CART_KEY, []);
    if (oids.length) {
      saveToStorage(StorageKey.BET_CART_KEY, betlist.filter(({ type }) => type !== 'fast'));
    }
  },
};
