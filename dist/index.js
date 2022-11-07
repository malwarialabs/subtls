// src/util/highlightCommented.ts
function highlightCommented_default(s, colour) {
  const css = [];
  s = s.replace(/  .+$/gm, (m) => {
    css.push(`color: ${colour}`, "color: inherit");
    return `%c${m}%c`;
  });
  return [s, ...css];
}

// src/util/array.ts
function concat(...arrs) {
  length = arrs.reduce((memo, arr) => memo + arr.length, 0);
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of arrs) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function equal(a, b) {
  const aLength = a.length;
  if (aLength !== b.length)
    return false;
  for (let i = 0; i < aLength; i++)
    if (a[i] !== b[i])
      return false;
  return true;
}

// src/util/bytes.ts
var txtEnc = new TextEncoder();
var Bytes = class {
  offset;
  dataView;
  uint8Array;
  comments;
  constructor(arrayOrMaxBytes) {
    this.offset = 0;
    this.uint8Array = typeof arrayOrMaxBytes === "number" ? new Uint8Array(arrayOrMaxBytes) : arrayOrMaxBytes;
    this.dataView = new DataView(this.uint8Array.buffer, this.uint8Array.byteOffset, this.uint8Array.byteLength);
    this.comments = {};
  }
  remainingBytes() {
    return this.uint8Array.length - this.offset;
  }
  subarray(length2) {
    return this.uint8Array.subarray(this.offset, this.offset += length2);
  }
  skip(length2, comment) {
    this.offset += length2;
    if (comment !== void 0)
      this.comment(comment);
    return this;
  }
  comment(s, offset = this.offset) {
    this.comments[offset] = s;
    return this;
  }
  readBytes(length2) {
    return this.uint8Array.slice(this.offset, this.offset += length2);
  }
  readUint8(comment) {
    const result = this.dataView.getUint8(this.offset);
    this.offset += 1;
    if (comment !== void 0)
      this.comment(comment.replace(/%/g, String(result)));
    return result;
  }
  readUint16(comment) {
    const result = this.dataView.getUint16(this.offset);
    this.offset += 2;
    if (comment !== void 0)
      this.comment(comment.replace(/%/g, String(result)));
    return result;
  }
  readUint24(comment) {
    const msb = this.readUint8();
    const lsbs = this.readUint16();
    const result = (msb << 16) + lsbs;
    if (comment !== void 0)
      this.comment(comment.replace(/%/g, String(result)));
    return result;
  }
  expectBytes(expected, comment) {
    const actual = this.readBytes(expected.length);
    if (comment !== void 0)
      this.comment(comment);
    if (!equal(actual, expected))
      throw new Error(`Unexpected bytes`);
  }
  expectUint8(expectedValue, comment) {
    const actualValue = this.readUint8();
    if (comment !== void 0)
      this.comment(comment);
    if (actualValue !== expectedValue)
      throw new Error(`Expected ${expectedValue}, got ${actualValue}`);
  }
  expectUint16(expectedValue, comment) {
    const actualValue = this.readUint16();
    if (comment !== void 0)
      this.comment(comment);
    if (actualValue !== expectedValue)
      throw new Error(`Expected ${expectedValue}, got ${actualValue}`);
  }
  expectUint24(expectedValue, comment) {
    const actualValue = this.readUint24();
    if (comment !== void 0)
      this.comment(comment);
    if (actualValue !== expectedValue)
      throw new Error(`Expected ${expectedValue}, got ${actualValue}`);
  }
  writeBytes(bytes) {
    this.uint8Array.set(bytes, this.offset);
    this.offset += bytes.length;
    return this;
  }
  writeUTF8String(s) {
    const bytes = txtEnc.encode(s);
    this.writeBytes(bytes);
    this.comment('"' + s + '"');
    return this;
  }
  writeUint8(...args) {
    for (const arg of args) {
      this.dataView.setUint8(this.offset, arg);
      this.offset += 1;
    }
    return this;
  }
  writeUint16(...args) {
    for (const arg of args) {
      this.dataView.setUint16(this.offset, arg);
      this.offset += 2;
    }
    return this;
  }
  _lengthGeneric(lengthBytes, comment) {
    const startOffset = this.offset;
    this.offset += lengthBytes;
    const endOffset = this.offset;
    return () => {
      const length2 = this.offset - endOffset;
      if (lengthBytes === 1)
        this.dataView.setUint8(startOffset, length2);
      else if (lengthBytes === 2)
        this.dataView.setUint16(startOffset, length2);
      else if (lengthBytes === 3) {
        this.dataView.setUint8(startOffset, (length2 & 16711680) >> 16);
        this.dataView.setUint16(startOffset + 1, length2 & 65535);
      } else
        throw new Error(`Invalid length for length field: ${lengthBytes}`);
      this.comment(`${length2} bytes${comment ? ` of ${comment}` : ""} follow`, endOffset);
    };
  }
  lengthUint8(comment) {
    return this._lengthGeneric(1, comment);
  }
  lengthUint16(comment) {
    return this._lengthGeneric(2, comment);
  }
  lengthUint24(comment) {
    return this._lengthGeneric(3, comment);
  }
  array() {
    return this.uint8Array.subarray(0, this.offset);
  }
  commentedString(s = "") {
    for (let i = 0; i < this.offset; i++) {
      s += this.uint8Array[i].toString(16).padStart(2, "0") + " ";
      const comment = this.comments[i + 1];
      if (comment !== void 0)
        s += ` ${comment}
`;
    }
    return s;
  }
};

// src/clientHello.ts
function makeClientHello(host, publicKey) {
  const h = new Bytes(1024);
  h.writeUint8(22);
  h.comment("record type: handshake");
  h.writeUint16(769);
  h.comment("TLS protocol version 1.0");
  const endRecordHeader = h.lengthUint16();
  h.writeUint8(1);
  h.comment("handshake type: client hello");
  const endHandshakeHeader = h.lengthUint24();
  h.writeUint16(771);
  h.comment("TLS version 1.2 (middlebox compatibility)");
  crypto.getRandomValues(h.subarray(32));
  h.comment("client random");
  const endSessionId = h.lengthUint8("session ID");
  const sessionId = h.subarray(32);
  crypto.getRandomValues(sessionId);
  h.comment("session ID (middlebox compatibility)");
  endSessionId();
  const endCiphers = h.lengthUint16("ciphers");
  h.writeUint16(4865);
  h.comment("cipher: TLS_AES_128_GCM_SHA256");
  endCiphers();
  const endCompressionMethods = h.lengthUint8("compression methods");
  h.writeUint8(0);
  h.comment("compression method: none");
  endCompressionMethods();
  const endExtensions = h.lengthUint16("extensions");
  h.writeUint16(0);
  h.comment("extension type: SNI");
  const endSNIExt = h.lengthUint16("SNI data");
  const endSNI = h.lengthUint16("SNI records");
  h.writeUint8(0);
  h.comment("list entry type: DNS hostname");
  const endHostname = h.lengthUint16("hostname");
  h.writeUTF8String(host);
  endHostname();
  endSNI();
  endSNIExt();
  h.writeUint16(11);
  h.comment("extension type: EC point formats");
  const endFormatTypesExt = h.lengthUint16("formats data");
  const endFormatTypes = h.lengthUint8("formats");
  h.writeUint8(0);
  h.comment("format: uncompressed");
  endFormatTypes();
  endFormatTypesExt();
  h.writeUint16(10);
  h.comment("extension type: supported groups (curves)");
  const endGroupsExt = h.lengthUint16("groups data");
  const endGroups = h.lengthUint16("groups");
  h.writeUint16(23);
  h.comment("curve secp256r1 (NIST P-256)");
  endGroups();
  endGroupsExt();
  h.writeUint16(13);
  h.comment("extension type: signature algorithms");
  const endSigsExt = h.lengthUint16("signature algorithms data");
  const endSigs = h.lengthUint16("signature algorithms");
  h.writeUint16(1027);
  h.comment("ECDSA-SECP256r1-SHA256");
  endSigs();
  endSigsExt();
  h.writeUint16(43);
  h.comment("extension type: supported TLS versions");
  const endVersionsExt = h.lengthUint16("TLS versions data");
  const endVersions = h.lengthUint8("TLS versions");
  h.writeUint16(772);
  h.comment("TLS version 1.3");
  endVersions();
  endVersionsExt();
  h.writeUint16(51);
  h.comment("extension type: key share");
  const endKeyShareExt = h.lengthUint16("key share data");
  const endKeyShares = h.lengthUint16("key shares");
  h.writeUint16(23);
  h.comment("secp256r1 (NIST P-256) key share");
  const endKeyShare = h.lengthUint16("key share");
  h.writeBytes(new Uint8Array(publicKey));
  h.comment("key");
  endKeyShare();
  endKeyShares();
  endKeyShareExt();
  endExtensions();
  endHandshakeHeader();
  endRecordHeader();
  return { clientHello: h, sessionId };
}

// src/util/readqueue.ts
var ReadQueue = class {
  queue;
  outstandingRequest;
  constructor(ws) {
    this.queue = [];
    ws.addEventListener("message", (msg) => this.enqueue(new Uint8Array(msg.data)));
  }
  enqueue(data) {
    this.queue.push(data);
    this.dequeue();
  }
  dequeue() {
    if (this.outstandingRequest === void 0)
      return;
    const { resolve, bytes } = this.outstandingRequest;
    const bytesInQueue = this.bytesInQueue();
    if (bytesInQueue < bytes)
      return;
    this.outstandingRequest = void 0;
    const firstItem = this.queue[0];
    const firstItemLength = firstItem.length;
    if (firstItemLength === bytes) {
      this.queue.shift();
      return resolve(firstItem);
    } else if (firstItemLength > bytes) {
      this.queue[0] = firstItem.subarray(bytes);
      return resolve(firstItem.subarray(0, bytes));
    } else {
      const result = new Uint8Array(bytes);
      let outstandingBytes = bytes;
      let offset = 0;
      while (outstandingBytes > 0) {
        const nextItem = this.queue[0];
        const nextItemLength = nextItem.length;
        if (nextItemLength <= outstandingBytes) {
          this.queue.shift();
          result.set(nextItem, offset);
          offset += nextItemLength;
          outstandingBytes -= nextItemLength;
        } else {
          this.queue[0] = nextItem.subarray(outstandingBytes);
          result.set(nextItem.subarray(0, outstandingBytes), offset);
          outstandingBytes -= outstandingBytes;
          offset += outstandingBytes;
        }
      }
      return resolve(result);
    }
  }
  bytesInQueue() {
    return this.queue.reduce((memo, arr) => memo + arr.length, 0);
  }
  async read(bytes) {
    if (this.outstandingRequest !== void 0)
      throw new Error("Can\u2019t read while already awaiting read");
    return new Promise((resolve) => {
      this.outstandingRequest = { resolve, bytes };
      this.dequeue();
    });
  }
};

// src/util/tlsrecord.ts
var RecordTypeNames = {
  20: "ChangeCipherSpec",
  21: "Alert",
  22: "Handshake",
  23: "Application",
  24: "Heartbeat"
};
var maxRecordLength = 1 << 14;
async function readTlsRecord(reader, expectedType) {
  const headerData = await reader.read(5);
  const header = new Bytes(headerData);
  const type = header.readUint8();
  if (type < 20 || type > 24)
    throw new Error(`Illegal TLS record type 0x${type.toString(16)}`);
  if (expectedType !== void 0 && type !== expectedType)
    throw new Error(`Unexpected TLS record type 0x${type.toString(16).padStart(2, "0")} (expected ${expectedType.toString(16).padStart(2, "0")})`);
  header.comment(`record type: ${RecordTypeNames[type]}`);
  const version = header.readUint16("TLS version");
  if ([769, 770, 771].indexOf(version) < 0)
    throw new Error(`Unsupported TLS record version 0x${version.toString(16).padStart(4, "0")}`);
  const length2 = header.readUint16("record length");
  if (length2 > maxRecordLength)
    throw new Error(`Record too long: ${length2} bytes`);
  const content = await reader.read(length2);
  return { headerData, header, type, version, length: length2, content };
}

// src/parseServerHello.ts
function parseServerHello(hello, sessionId) {
  let serverPublicKey;
  let tlsVersionSpecified;
  hello.expectUint8(2, "handshake type: server hello");
  const helloLength = hello.readUint24("server hello length");
  hello.expectUint16(771, "TLS version 1.2 (middlebox compatibility)");
  const serverRandom = hello.readBytes(32);
  if (equal(serverRandom, [
    207,
    33,
    173,
    116,
    229,
    154,
    97,
    17,
    190,
    29,
    140,
    2,
    30,
    101,
    184,
    145,
    194,
    162,
    17,
    22,
    122,
    187,
    140,
    94,
    7,
    158,
    9,
    226,
    200,
    168,
    51,
    156
  ]))
    throw new Error("Unexpected HelloRetryRequest");
  hello.comment('server random, not SHA256("HelloRetryRequest")');
  hello.expectUint8(32, "session ID length");
  hello.expectBytes(sessionId, "session ID");
  hello.expectUint16(4865, "cipher (matches client hello)");
  hello.expectUint8(0, "no compression");
  const extensionsLength = hello.readUint16("extensions length");
  while (hello.remainingBytes() > 0) {
    const extensionType = hello.readUint16("extension type");
    const extensionLength = hello.readUint16("extension length");
    if (extensionType === 43) {
      if (extensionLength !== 2)
        throw new Error(`Unexpected extension length: ${extensionLength} (expected 2)`);
      hello.expectUint16(772, "TLS version 1.3");
      tlsVersionSpecified = true;
    } else if (extensionType === 51) {
      hello.expectUint16(23, "secp256r1 (NIST P-256) key share");
      hello.expectUint16(65);
      serverPublicKey = hello.readBytes(65);
      hello.comment("key");
    } else {
      throw new Error(`Unexpected extension 0x${extensionType.toString(16).padStart(4, "0")}, length ${extensionLength}`);
    }
  }
  if (hello.remainingBytes() !== 0)
    throw new Error(`Unexpected additional data at end of server hello`);
  if (tlsVersionSpecified !== true || serverPublicKey === void 0)
    throw new Error(`Incomplete server hello`);
  return serverPublicKey;
}

// src/util/hex.ts
function hexFromU8(u8) {
  return [...u8].map((n) => n.toString(16).padStart(2, "0")).join("");
}

// src/keyscalc.ts
var txtEnc2 = new TextEncoder();
async function hkdfExtract(salt, keyMaterial, hashBits) {
  const hmacKey = await crypto.subtle.importKey("raw", salt, { name: "HMAC", hash: { name: `SHA-${hashBits}` } }, false, ["sign"]);
  var prk = new Uint8Array(await crypto.subtle.sign("HMAC", hmacKey, keyMaterial));
  return prk;
}
async function hkdfExpand(key, info, length2, hashBits) {
  const hashBytes = hashBits >> 3;
  const n = Math.ceil(length2 / hashBytes);
  const okm = new Uint8Array(n * hashBytes);
  const hmacKey = await crypto.subtle.importKey("raw", key, { name: "HMAC", hash: { name: `SHA-${hashBits}` } }, false, ["sign"]);
  let tPrev = new Uint8Array(0);
  for (let i = 0; i < n; i++) {
    const hmacData = concat(tPrev, info, [i + 1]);
    const tiBuffer = await crypto.subtle.sign("HMAC", hmacKey, hmacData);
    const ti = new Uint8Array(tiBuffer);
    okm.set(ti, hashBytes * i);
    tPrev = ti;
  }
  return okm.subarray(0, length2);
}
var tls13_Bytes = txtEnc2.encode("tls13 ");
async function hkdfExpandLabel(key, label, context, length2, hashBits) {
  const hkdfLabel = concat(
    [(length2 & 65280) >> 8, length2 & 255],
    [tls13_Bytes.length + label.length],
    tls13_Bytes,
    label,
    [context.length],
    context
  );
  return hkdfExpand(key, hkdfLabel, length2, hashBits);
}
async function getHandshakeKeys(sharedSecret, hellosHash, hashBits, keyLength) {
  const hashBytes = hashBits >> 3;
  const zeroKey = new Uint8Array(hashBytes);
  const earlySecret = await hkdfExtract(new Uint8Array(1), zeroKey, hashBits);
  console.log("early secret", hexFromU8(new Uint8Array(earlySecret)));
  const emptyHashBuffer = await crypto.subtle.digest(`SHA-${hashBits}`, new Uint8Array(0));
  const emptyHash = new Uint8Array(emptyHashBuffer);
  console.log("empty hash", hexFromU8(emptyHash));
  const derivedSecret = await hkdfExpandLabel(earlySecret, txtEnc2.encode("derived"), emptyHash, hashBytes, hashBits);
  console.log("derived secret", hexFromU8(derivedSecret));
  const handshakeSecret = await hkdfExtract(derivedSecret, sharedSecret, hashBits);
  console.log("handshake secret", hexFromU8(handshakeSecret));
  const clientSecret = await hkdfExpandLabel(handshakeSecret, txtEnc2.encode("c hs traffic"), hellosHash, hashBytes, hashBits);
  console.log("client secret", hexFromU8(clientSecret));
  const serverSecret = await hkdfExpandLabel(handshakeSecret, txtEnc2.encode("s hs traffic"), hellosHash, hashBytes, hashBits);
  console.log("server secret", hexFromU8(serverSecret));
  const clientHandshakeKey = await hkdfExpandLabel(clientSecret, txtEnc2.encode("key"), new Uint8Array(0), keyLength, hashBits);
  console.log("client handshake key", hexFromU8(clientHandshakeKey));
  const serverHandshakeKey = await hkdfExpandLabel(serverSecret, txtEnc2.encode("key"), new Uint8Array(0), keyLength, hashBits);
  console.log("server handshake key", hexFromU8(serverHandshakeKey));
  const clientHandshakeIV = await hkdfExpandLabel(clientSecret, txtEnc2.encode("iv"), new Uint8Array(0), 12, hashBits);
  console.log("client handshake iv", hexFromU8(clientHandshakeIV));
  const serverHandshakeIV = await hkdfExpandLabel(serverSecret, txtEnc2.encode("iv"), new Uint8Array(0), 12, hashBits);
  console.log("server handshake iv", hexFromU8(serverHandshakeIV));
  return { serverHandshakeKey, serverHandshakeIV, clientHandshakeKey, clientHandshakeIV };
}

// src/aesgcm.ts
var Decrypter = class {
  key;
  iv;
  ivDataView;
  recordsDecrypted = 0;
  constructor(key, initialIv) {
    this.key = key;
    this.iv = initialIv;
    this.ivDataView = new DataView(this.iv.buffer, this.iv.byteOffset, this.iv.byteLength);
  }
  async decrypt(cipherTextPlusAuthTag, authTagLength, additionalData) {
    const ivLength = this.iv.length;
    const authTagBits = authTagLength << 3;
    let ivLast32 = this.ivDataView.getUint32(ivLength - 4);
    ivLast32 ^= this.recordsDecrypted;
    this.ivDataView.setUint32(ivLength - 4, ivLast32);
    this.recordsDecrypted += 1;
    const algorithm = { name: "AES-GCM", iv: this.iv, tagLength: authTagBits, additionalData };
    const plainTextBuffer = await crypto.subtle.decrypt(algorithm, this.key, cipherTextPlusAuthTag);
    const plainText = new Uint8Array(plainTextBuffer);
    return plainText;
  }
};

// src/index.ts
var clientColour = "#8c8";
var serverColour = "#88c";
var headerColor = "#c88";
async function startTls(host, port) {
  const ecdhKeys = await crypto.subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveKey", "deriveBits"]);
  const rawPublicKey = await crypto.subtle.exportKey("raw", ecdhKeys.publicKey);
  const ws = await new Promise((resolve) => {
    const ws2 = new WebSocket(`ws://localhost:9999/?name=${host}:${port}`);
    ws2.binaryType = "arraybuffer";
    ws2.addEventListener("open", () => resolve(ws2));
  });
  const reader = new ReadQueue(ws);
  const { clientHello, sessionId } = makeClientHello(host, rawPublicKey);
  console.log(...highlightCommented_default(clientHello.commentedString(), clientColour));
  const clientHelloData = clientHello.array();
  ws.send(clientHelloData);
  const serverHelloRecord = await readTlsRecord(reader, 22 /* Handshake */);
  const serverHello = new Bytes(serverHelloRecord.content);
  const serverRawPublicKey = parseServerHello(serverHello, sessionId);
  console.log(...highlightCommented_default(serverHelloRecord.header.commentedString() + serverHello.commentedString(), serverColour));
  const changeCipherRecord = await readTlsRecord(reader, 20 /* ChangeCipherSpec */);
  const ccipher = new Bytes(changeCipherRecord.content);
  ccipher.expectUint8(1, "dummy ChangeCipherSpec payload (middlebox compatibility)");
  if (ccipher.remainingBytes() !== 0)
    throw new Error(`Unexpected additional data at end of ChangeCipherSpec`);
  console.log(...highlightCommented_default(changeCipherRecord.header.commentedString() + ccipher.commentedString(), serverColour));
  console.log("%c%s", `color: ${headerColor}`, "handshake key computations");
  const serverPublicKey = await crypto.subtle.importKey("raw", serverRawPublicKey, { name: "ECDH", namedCurve: "P-256" }, false, []);
  const sharedSecretBuffer = await crypto.subtle.deriveBits({ name: "ECDH", public: serverPublicKey }, ecdhKeys.privateKey, 256);
  const sharedSecret = new Uint8Array(sharedSecretBuffer);
  console.log("shared secret", hexFromU8(sharedSecret));
  const clientHelloContent = clientHelloData.subarray(5);
  const serverHelloContent = serverHelloRecord.content;
  const hellos = concat(clientHelloContent, serverHelloContent);
  const hellosHashBuffer = await crypto.subtle.digest("SHA-256", hellos);
  const hellosHash = new Uint8Array(hellosHashBuffer);
  console.log("hellos hash", hexFromU8(hellosHash));
  const handshakeKeys = await getHandshakeKeys(sharedSecret, hellosHash, 256, 16);
  const serverHandshakeKey = await crypto.subtle.importKey("raw", handshakeKeys.serverHandshakeKey, { name: "AES-GCM" }, false, ["decrypt"]);
  const handshakeDecrypter = new Decrypter(serverHandshakeKey, handshakeKeys.serverHandshakeIV);
  const encrypted = await readTlsRecord(reader, 23 /* Application */);
  console.log(...highlightCommented_default(encrypted.header.commentedString(), serverColour));
  console.log("%s%c  %s", hexFromU8(encrypted.content), `color: ${serverColour}`, "encrypted payload + auth tag");
  const decrypted = await handshakeDecrypter.decrypt(encrypted.content, 16, encrypted.headerData);
  console.log("%s%c  %s", hexFromU8(decrypted), `color: ${serverColour}`, "decrypted payload");
  const hs = new Bytes(decrypted);
  hs.expectUint8(8, "handshake record type: encrypted extensions");
  const eeMessageLength = hs.readUint24("% bytes of handshake data follows");
  const extLength = hs.readUint16("% bytes of extensions data follow");
  if (extLength > 0) {
    if (extLength !== 4)
      throw new Error("Unexpected extensions");
    hs.expectUint16(0, "extension type: SNI");
    hs.expectUint16(0, "no extension data");
  }
  hs.expectUint8(11, "handshake record type: server certificate");
  const certPayloadLength = hs.readUint24("% bytes of certificate payload follow");
  hs.expectUint8(0, "0 bytes of request content follow");
  const certsLength = hs.readUint24("% bytes of certificates follow");
  const cert1Length = hs.readUint24("% bytes of first certificate follow");
  const cert1 = hs.readBytes(cert1Length);
  hs.comment("server certificate");
  const cert1ExtLength = hs.readUint16("% bytes of certificate extensions follow");
  console.log(...highlightCommented_default(hs.commentedString(), serverColour));
}
startTls("google.com", 443);
