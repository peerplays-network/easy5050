import { Aes } from 'peerplaysjs-lib';

class CryptoService {

    static formEncryption(password, encryption_key) {
        return Aes.fromSeed(password).decryptHexToBuffer(encryption_key).toString('hex');
    }
}

export default CryptoService;
