function p(...r){if(r.length===1&&r[0]instanceof Uint8Array)return r[0];let e=r.
reduce((n,a)=>n+a.length,0),t=new Uint8Array(e),i=0;for(let n of r)t.set(n,i),i+=
n.length;return t}function O(r,e){let t=r.length;if(t!==e.length)return!1;for(let i=0;i<
t;i++)if(r[i]!==e[i])return!1;return!0}var it="\xB7\xB7 ";var Nt=new TextEncoder,Yt=new TextDecoder,N=class{offset;dataView;data;comments;indents;indent;constructor(e){
this.offset=0,this.data=typeof e=="number"?new Uint8Array(e):e,this.dataView=new DataView(
this.data.buffer,this.data.byteOffset,this.data.byteLength),this.comments={},this.
indents={},this.indent=0}extend(e){let t=typeof e=="number"?new Uint8Array(e):e;
this.data=p(this.data,t),this.dataView=new DataView(this.data.buffer,this.data.byteOffset,
this.data.byteLength)}remaining(){return this.data.length-this.offset}subarray(e){
return this.data.subarray(this.offset,this.offset+=e)}skip(e,t){return this.offset+=
e,t&&this.comment(t),this}comment(e,t=this.offset){throw new Error("No comments \
should be emitted outside of chatty mode")}readBytes(e){return this.data.slice(this.
offset,this.offset+=e)}readUTF8String(e){let t=this.subarray(e);return Yt.decode(
t)}readUTF8StringNullTerminated(){let e=this.offset;for(;this.data[e]!==0;)e++;let t=this.
readUTF8String(e-this.offset);return this.expectUint8(0,"end of string"),t}readUint8(e){
let t=this.dataView.getUint8(this.offset);return this.offset+=1,t}readUint16(e){
let t=this.dataView.getUint16(this.offset);return this.offset+=2,t}readUint24(e){
let t=this.readUint8(),i=this.readUint16();return(t<<16)+i}readUint32(e){let t=this.
dataView.getUint32(this.offset);return this.offset+=4,t}expectBytes(e,t){let i=this.
readBytes(e.length);if(!O(i,e))throw new Error("Unexpected bytes")}expectUint8(e,t){
let i=this.readUint8();if(i!==e)throw new Error(`Expected ${e}, got ${i}`)}expectUint16(e,t){
let i=this.readUint16();if(i!==e)throw new Error(`Expected ${e}, got ${i}`)}expectUint24(e,t){
let i=this.readUint24();if(i!==e)throw new Error(`Expected ${e}, got ${i}`)}expectUint32(e,t){
let i=this.readUint32();if(i!==e)throw new Error(`Expected ${e}, got ${i}`)}expectLength(e,t=1){
let i=this.offset,n=i+e;if(n>this.data.length)throw new Error("Expected length e\
xceeds remaining data length");return this.indent+=t,this.indents[i]=this.indent,
[()=>{if(this.indent-=t,this.indents[this.offset]=this.indent,this.offset!==n)throw new Error(
`${e} bytes expected but ${this.offset-i} read`)},()=>n-this.offset]}expectLengthUint8(e){
let t=this.readUint8();return this.expectLength(t)}expectLengthUint16(e){let t=this.
readUint16();return this.expectLength(t)}expectLengthUint24(e){let t=this.readUint24();
return this.expectLength(t)}expectLengthUint32(e){let t=this.readUint32();return this.
expectLength(t)}expectLengthUint8Incl(e){let t=this.readUint8();return this.expectLength(
t-1)}expectLengthUint16Incl(e){let t=this.readUint16();return this.expectLength(
t-2)}expectLengthUint24Incl(e){let t=this.readUint24();return this.expectLength(
t-3)}expectLengthUint32Incl(e){let t=this.readUint32();return this.expectLength(
t-4)}writeBytes(e){return this.data.set(e,this.offset),this.offset+=e.length,this}writeUTF8String(e){
let t=Nt.encode(e);return this.writeBytes(t),this}writeUTF8StringNullTerminated(e){
let t=Nt.encode(e);return this.writeBytes(t),this.writeUint8(0),this}writeUint8(e,t){
return this.dataView.setUint8(this.offset,e),this.offset+=1,this}writeUint16(e,t){
return this.dataView.setUint16(this.offset,e),this.offset+=2,this}writeUint24(e,t){
return this.writeUint8((e&16711680)>>16),this.writeUint16(e&65535,t),this}writeUint32(e,t){
return this.dataView.setUint32(this.offset,e),this.offset+=4,this}_writeLengthGeneric(e,t,i){
let n=this.offset;this.offset+=e;let a=this.offset;return this.indent+=1,this.indents[a]=
this.indent,()=>{let c=this.offset-(t?n:a);if(e===1)this.dataView.setUint8(n,c);else if(e===
2)this.dataView.setUint16(n,c);else if(e===3)this.dataView.setUint8(n,(c&16711680)>>
16),this.dataView.setUint16(n+1,c&65535);else if(e===4)this.dataView.setUint32(n,
c);else throw new Error(`Invalid length for length field: ${e}`);this.indent-=1,
this.indents[this.offset]=this.indent}}writeLengthUint8(e){return this._writeLengthGeneric(
1,!1,e)}writeLengthUint16(e){return this._writeLengthGeneric(2,!1,e)}writeLengthUint24(e){
return this._writeLengthGeneric(3,!1,e)}writeLengthUint32(e){return this._writeLengthGeneric(
4,!1,e)}writeLengthUint8Incl(e){return this._writeLengthGeneric(1,!0,e)}writeLengthUint16Incl(e){
return this._writeLengthGeneric(2,!0,e)}writeLengthUint24Incl(e){return this._writeLengthGeneric(
3,!0,e)}writeLengthUint32Incl(e){return this._writeLengthGeneric(4,!0,e)}array(){
return this.data.subarray(0,this.offset)}commentedString(e=!1){let t=this.indents[0]!==
void 0?it.repeat(this.indents[0]):"",i=this.indents[0]??0,n=e?this.data.length:this.
offset;for(let a=0;a<n;a++){t+=this.data[a].toString(16).padStart(2,"0")+" ";let c=this.
comments[a+1];this.indents[a+1]!==void 0&&(i=this.indents[a+1]),c&&(t+=` ${c}
${it.repeat(i)}`)}return t}};function St(r,e,t,i=!0){let n=new N(1024);n.writeUint8(22,0),n.writeUint16(769,0);
let a=n.writeLengthUint16();n.writeUint8(1,0);let c=n.writeLengthUint24();n.writeUint16(
771,0),crypto.getRandomValues(n.subarray(32));let s=n.writeLengthUint8(0);n.writeBytes(
t),s();let o=n.writeLengthUint16(0);n.writeUint16(4865,0),o();let h=n.writeLengthUint8(
0);n.writeUint8(0,0),h();let y=n.writeLengthUint16(0);if(i){n.writeUint16(0,0);let q=n.
writeLengthUint16(0),G=n.writeLengthUint16(0);n.writeUint8(0,0);let D=n.writeLengthUint16(
0);n.writeUTF8String(r),D(),G(),q()}n.writeUint16(11,0);let d=n.writeLengthUint16(
0),m=n.writeLengthUint8(0);n.writeUint8(0,0),m(),d(),n.writeUint16(10,0);let g=n.
writeLengthUint16(0),A=n.writeLengthUint16(0);n.writeUint16(23,0),A(),g(),n.writeUint16(
13,0);let L=n.writeLengthUint16(0),f=n.writeLengthUint16(0);n.writeUint16(1027,0),
n.writeUint16(2052,0),f(),L(),n.writeUint16(43,0);let u=n.writeLengthUint16(0),x=n.
writeLengthUint8(0);n.writeUint16(772,0),x(),u(),n.writeUint16(51,0);let T=n.writeLengthUint16(
0),$=n.writeLengthUint16(0);n.writeUint16(23,0);let P=n.writeLengthUint16(0);return n.
writeBytes(new Uint8Array(e)),P(),$(),T(),y(),c(),a(),n}function K(r,e=""){return[...r].map(t=>t.toString(16).padStart(2,"0")).join(e)}function Ut(r,e){let t,i,[n]=r.expectLength(r.remaining());r.expectUint8(2,0);let[
a]=r.expectLengthUint24(0);r.expectUint16(771,0);let c=r.readBytes(32);if(O(c,[207,
33,173,116,229,154,97,17,190,29,140,2,30,101,184,145,194,162,17,22,122,187,140,94,
7,158,9,226,200,168,51,156]))throw new Error("Unexpected HelloRetryRequest");r.expectUint8(
e.length,0),r.expectBytes(e,0),r.expectUint16(4865,0),r.expectUint8(0,0);let[s,o]=r.
expectLengthUint16(0);for(;o()>0;){let h=r.readUint16(0),[y]=r.expectLengthUint16(
0);if(h===43)r.expectUint16(772,0),i=!0;else if(h===51)r.expectUint16(23,0),r.expectUint16(
65),t=r.readBytes(65);else throw new Error(`Unexpected extension 0x${K([h])}`);y()}
if(s(),a(),n(),i!==!0)throw new Error("No TLS version provided");if(t===void 0)throw new Error(
"No key provided");return t}var Ce=new RegExp(`  .+|^(${it})+`,"gm");var rt=16384,te=rt+1+255;async function ht(r,e,t=rt){let n=await r(5);if(n===void 0)
return;if(n.length<5)throw new Error("TLS record header truncated");let a=new N(
n),c=a.readUint8();if(c<20||c>24)throw new Error(`Illegal TLS record type 0x${c.
toString(16)}`);if(e!==void 0&&c!==e)throw new Error(`Unexpected TLS record type\
 0x${c.toString(16).padStart(2,"0")} (expected 0x${e.toString(16).padStart(2,"0")}\
)`);a.expectUint16(771,"TLS record version 1.2 (middlebox compatibility)");let s=a.
readUint16(0);if(s>t)throw new Error(`Record too long: ${s} bytes`);let o=await r(
s);if(o===void 0||o.length<s)throw new Error("TLS record content truncated");return{
headerData:n,header:a,type:c,length:s,content:o}}async function dt(r,e,t){let i=await ht(
r,23,te);if(i===void 0)return;let n=new N(i.content),[a]=n.expectLength(n.remaining());
n.skip(i.length-16,0),n.skip(16,0),a();let c=await e.process(i.content,16,i.headerData),
s=c.length-1;for(;c[s]===0;)s-=1;if(s<0)throw new Error("Decrypted message has n\
o record type indicator (all zeroes)");let o=c[s],h=c.subarray(0,s);if(!(o===21&&
h.length===2&&h[0]===1&&h[1]===0)){if(o===22&&h[0]===4)return dt(r,e,t);if(t!==void 0&&
o!==t)throw new Error(`Unexpected TLS record type 0x${o.toString(16).padStart(2,
"0")} (expected 0x${t.toString(16).padStart(2,"0")})`);return h}}async function ee(r,e,t){
let i=p(r,[t]),n=5,s=i.length+16,o=new N(n+s);o.writeUint8(23,0),o.writeUint16(771,
0),o.writeUint16(s,`${s} bytes follow`);let[h]=o.expectLength(s),y=o.array(),d=await e.
process(i,16,y);return o.writeBytes(d.subarray(0,d.length-16)),o.writeBytes(d.subarray(
d.length-16)),h(),o.array()}async function At(r,e,t){let i=Math.ceil(r.length/rt),
n=[];for(let a=0;a<i;a++){let c=r.subarray(a*rt,(a+1)*rt),s=await ee(c,e,t);n.push(
s)}return n}var l=crypto.subtle;var Ht=new TextEncoder;async function lt(r,e,t){let i=await l.importKey("raw",r,
{name:"HMAC",hash:{name:`SHA-${t}`}},!1,["sign"]);var n=new Uint8Array(await l.sign(
"HMAC",i,e));return n}async function ne(r,e,t,i){let n=i>>3,a=Math.ceil(t/n),c=new Uint8Array(
a*n),s=await l.importKey("raw",r,{name:"HMAC",hash:{name:`SHA-${i}`}},!1,["sign"]),
o=new Uint8Array(0);for(let h=0;h<a;h++){let y=p(o,e,[h+1]),d=await l.sign("HMAC",
s,y),m=new Uint8Array(d);c.set(m,n*h),o=m}return c.subarray(0,t)}var Rt=Ht.encode(
"tls13 ");async function S(r,e,t,i,n){let a=Ht.encode(e),c=p([(i&65280)>>8,i&255],
[Rt.length+a.length],Rt,a,[t.length],t);return ne(r,c,i,n)}async function Kt(r,e,t,i,n){let a=i>>>3,c=new Uint8Array(a),s=await l.importKey(
"raw",r,{name:"ECDH",namedCurve:"P-256"},!1,[]),o=await l.deriveBits({name:"ECDH",
public:s},e,256),h=new Uint8Array(o),y=await l.digest("SHA-256",t),d=new Uint8Array(
y),m=await lt(new Uint8Array(1),c,i),g=await l.digest(`SHA-${i}`,new Uint8Array(
0)),A=new Uint8Array(g),L=await S(m,"derived",A,a,i),f=await lt(L,h,i),u=await S(
f,"c hs traffic",d,a,i),x=await S(f,"s hs traffic",d,a,i),T=await S(u,"key",new Uint8Array(
0),n,i),$=await S(x,"key",new Uint8Array(0),n,i),P=await S(u,"iv",new Uint8Array(
0),12,i),q=await S(x,"iv",new Uint8Array(0),12,i);return{serverHandshakeKey:$,serverHandshakeIV:q,
clientHandshakeKey:T,clientHandshakeIV:P,handshakeSecret:f,clientSecret:u,serverSecret:x}}
async function Tt(r,e,t,i){let n=t>>>3,a=new Uint8Array(n),c=await l.digest(`SHA\
-${t}`,new Uint8Array(0)),s=new Uint8Array(c),o=await S(r,"derived",s,n,t),h=await lt(
o,a,t),y=await S(h,"c ap traffic",e,n,t),d=await S(h,"s ap traffic",e,n,t),m=await S(
y,"key",new Uint8Array(0),i,t),g=await S(d,"key",new Uint8Array(0),i,t),A=await S(
y,"iv",new Uint8Array(0),12,t),L=await S(d,"iv",new Uint8Array(0),12,t);return{serverApplicationKey:g,
serverApplicationIV:L,clientApplicationKey:m,clientApplicationIV:A}}var Z=class{constructor(e,t,i){this.mode=e;this.key=t;this.initialIv=i}recordsProcessed=0n;priorPromise=Promise.
resolve(new Uint8Array);async process(e,t,i){let n=this.processUnsequenced(e,t,i);
return this.priorPromise=this.priorPromise.then(()=>n)}async processUnsequenced(e,t,i){
let n=this.recordsProcessed;this.recordsProcessed+=1n;let a=this.initialIv.slice(),
c=BigInt(a.length),s=c-1n;for(let m=0n;m<c;m++){let g=n>>(m<<3n);if(g===0n)break;
a[Number(s-m)]^=Number(g&0xffn)}let o=t<<3,h={name:"AES-GCM",iv:a,tagLength:o,additionalData:i},
y=await l[this.mode](h,this.key,e);return new Uint8Array(y)}};function yt(r){return r>64&&r<91?r-65:r>96&&r<123?r-71:r>47&&r<58?r+4:r===43?62:
r===47?63:r===61?64:void 0}function Dt(r){let e=r.length,t=0,i=0,n=64,a=64,c=64,
s=64,o=new Uint8Array(e*.75);for(;t<e;)n=yt(r.charCodeAt(t++)),a=yt(r.charCodeAt(
t++)),c=yt(r.charCodeAt(t++)),s=yt(r.charCodeAt(t++)),o[i++]=n<<2|a>>4,o[i++]=(a&
15)<<4|c>>2,o[i++]=(c&3)<<6|s;let h=a===64?0:c===64?2:s===64?1:0;return o.subarray(
0,i-h)}var M=class extends N{readASN1Length(e){let t=this.readUint8();if(t<128)return t;
let i=t&127,n=0;if(i===1)return this.readUint8(n);if(i===2)return this.readUint16(
n);if(i===3)return this.readUint24(n);if(i===4)return this.readUint32(n);throw new Error(
`ASN.1 length fields are only supported up to 4 bytes (this one is ${i} bytes)`)}expectASN1Length(e){
let t=this.readASN1Length(e);return this.expectLength(t)}readASN1OID(){let[e,t]=this.
expectASN1Length(0),i=this.readUint8(),n=`${Math.floor(i/40)}.${i%40}`;for(;t()>
0;){let a=0;for(;;){let c=this.readUint8();if(a<<=7,a+=c&127,c<128)break}n+=`.${a}`}
return e(),n}readASN1Boolean(){let[e,t]=this.expectASN1Length(0),i=t();if(i!==1)
throw new Error(`Boolean has weird length: ${i}`);let n=this.readUint8(),a;if(n===
255)a=!0;else if(n===0)a=!1;else throw new Error(`Boolean has weird value: 0x${K(
[n])}`);return e(),a}readASN1UTCTime(){let[e,t]=this.expectASN1Length(0),n=this.
readUTF8String(t()).match(/^(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)(\d\d)Z$/);if(!n)throw new Error(
"Unrecognised ASN.1 UTC time format");let[,a,c,s,o,h,y]=n,d=parseInt(a,10),m=d+(d>=
50?1900:2e3),g=new Date(`${m}-${c}-${s}T${o}:${h}:${y}Z`);return e(),g}readASN1BitString(){
let[e,t]=this.expectASN1Length(0),i=this.readUint8(0),n=t(),a=this.readBytes(n);
if(i>7)throw new Error(`Invalid right pad value: ${i}`);if(i>0){let c=8-i;for(let s=n-
1;s>0;s--)a[s]=255&a[s-1]<<c|a[s]>>>i;a[0]=a[0]>>>i}return e(),a}};function mt(r,e=(i,n)=>n,t){return JSON.stringify(r,(n,a)=>e(n,typeof a!="object"||
a===null||Array.isArray(a)?a:Object.fromEntries(Object.entries(a).sort(([c],[s])=>c<
s?-1:c>s?1:0))),t)}var gt=1,tt=2,U=48,ie=49,Q=6,re=19,se=12,bt=23,ft=5,_=4,ut=3,$t=163,W=128;var ae={"2.5.4.6":"C","2.5.4.10":"O","2.5.4.11":"OU","2.5.4.3":"CN","2.5.4.7":"L",
"2.5.4.8":"ST","2.5.4.12":"T","2.5.4.42":"GN","2.5.4.43":"I","2.5.4.4":"SN","1.2\
.840.113549.1.9.1":"E-mail"};function qt(r){let{length:e}=r;if(e>4)throw new Error(`Bit string length ${e} wo\
uld overflow JS bit operators`);let t=0,i=0;for(let n=r.length-1;n>=0;n--)t|=r[n]<<
i,i+=8;return t}function Ct(r,e){let t={};r.expectUint8(U,0);let[i,n]=r.expectASN1Length(
0);for(;n()>0;){r.expectUint8(ie,0);let[a]=r.expectASN1Length(0);r.expectUint8(U,
0);let[c]=r.expectASN1Length(0);r.expectUint8(Q,0);let s=r.readASN1OID(),o=ae[s]??
s,h=r.readUint8();if(h!==re){if(h!==se)throw new Error(`Unexpected item type in \
certificate ${e}: 0x${K([h])}`)}let[y,d]=r.expectASN1Length(0),m=r.readUTF8String(
d());if(y(),c(),a(),t[o]!==void 0)throw new Error(`Duplicate OID ${o} in certifi\
cate ${e}`);t[o]=m}return i(),t}function Bt(r,e=0){let t=[],[i,n]=r.expectASN1Length(
0);for(;n()>0;){let a=r.readUint8(0),[c,s]=r.expectASN1Length(0),o;a===(e|2)?o=r.
readUTF8String(s()):o=r.readBytes(s()),t.push({name:o,type:a}),c()}return i(),t}
function Ft(r){let e={"1.2.840.113549.1.1.1":{name:"RSAES-PKCS1-v1_5"},"1.2.840.\
113549.1.1.5":{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-1"}},"1.2.840.113549.1.1\
.11":{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}},"1.2.840.113549.1.1.12":{name:"\
RSASSA-PKCS1-v1_5",hash:{name:"SHA-384"}},"1.2.840.113549.1.1.13":{name:"RSASSA-\
PKCS1-v1_5",hash:{name:"SHA-512"}},"1.2.840.113549.1.1.10":{name:"RSA-PSS"},"1.2\
.840.113549.1.1.7":{name:"RSA-OAEP"},"1.2.840.10045.2.1":{name:"ECDSA",hash:{name:"\
SHA-1"}},"1.2.840.10045.4.1":{name:"ECDSA",hash:{name:"SHA-1"}},"1.2.840.10045.4\
.3.2":{name:"ECDSA",hash:{name:"SHA-256"}},"1.2.840.10045.4.3.3":{name:"ECDSA",hash:{
name:"SHA-384"}},"1.2.840.10045.4.3.4":{name:"ECDSA",hash:{name:"SHA-512"}},"1.3\
.133.16.840.63.0.2":{name:"ECDH",kdf:"SHA-1"},"1.3.132.1.11.1":{name:"ECDH",kdf:"\
SHA-256"},"1.3.132.1.11.2":{name:"ECDH",kdf:"SHA-384"},"1.3.132.1.11.3":{name:"E\
CDH",kdf:"SHA-512"},"2.16.840.1.101.3.4.1.2":{name:"AES-CBC",length:128},"2.16.8\
40.1.101.3.4.1.22":{name:"AES-CBC",length:192},"2.16.840.1.101.3.4.1.42":{name:"\
AES-CBC",length:256},"2.16.840.1.101.3.4.1.6":{name:"AES-GCM",length:128},"2.16.\
840.1.101.3.4.1.26":{name:"AES-GCM",length:192},"2.16.840.1.101.3.4.1.46":{name:"\
AES-GCM",length:256},"2.16.840.1.101.3.4.1.4":{name:"AES-CFB",length:128},"2.16.\
840.1.101.3.4.1.24":{name:"AES-CFB",length:192},"2.16.840.1.101.3.4.1.44":{name:"\
AES-CFB",length:256},"2.16.840.1.101.3.4.1.5":{name:"AES-KW",length:128},"2.16.8\
40.1.101.3.4.1.25":{name:"AES-KW",length:192},"2.16.840.1.101.3.4.1.45":{name:"A\
ES-KW",length:256},"1.2.840.113549.2.7":{name:"HMAC",hash:{name:"SHA-1"}},"1.2.8\
40.113549.2.9":{name:"HMAC",hash:{name:"SHA-256"}},"1.2.840.113549.2.10":{name:"\
HMAC",hash:{name:"SHA-384"}},"1.2.840.113549.2.11":{name:"HMAC",hash:{name:"SHA-\
512"}},"1.2.840.113549.1.9.16.3.5":{name:"DH"},"1.3.14.3.2.26":{name:"SHA-1"},"2\
.16.840.1.101.3.4.2.1":{name:"SHA-256"},"2.16.840.1.101.3.4.2.2":{name:"SHA-384"},
"2.16.840.1.101.3.4.2.3":{name:"SHA-512"},"1.2.840.113549.1.5.12":{name:"PBKDF2"},
"1.2.840.10045.3.1.7":{name:"P-256"},"1.3.132.0.34":{name:"P-384"},"1.3.132.0.35":{
name:"P-521"}}[r];if(e===void 0)throw new Error(`Unsupported algorithm identifie\
r: ${r}`);return e}function Ot(r,e=[]){return Object.values(r).forEach(t=>{typeof t==
"string"?e=[...e,t]:e=Ot(t,e)}),e}function Pt(r){return Ot(r).join(" / ")}var ce=["digitalSignature","nonRepudiation","keyEncipherment","dataEncipherment",
"keyAgreement","keyCertSign","cRLSign","encipherOnly","decipherOnly"],X=class r{serialNumber;algorithm;issuer;validityPeriod;subject;publicKey;signature;keyUsage;subjectAltNames;extKeyUsage;authorityKeyIdentifier;subjectKeyIdentifier;basicConstraints;signedData;static distinguishedNamesAreEqual(e,t){
return mt(e)===mt(t)}static readableDN(e){return Object.entries(e).map(t=>t.join(
"=")).join(", ")}constructor(e){let t=e instanceof M?e:new M(e);t.expectUint8(U,
0);let[i]=t.expectASN1Length(0),n=t.offset;t.expectUint8(U,0);let[a]=t.expectASN1Length(
0);t.expectBytes([160,3,2,1,2],0),t.expectUint8(tt,0);let[c,s]=t.expectASN1Length(
0);this.serialNumber=t.subarray(s()),c(),t.expectUint8(U,0);let[o,h]=t.expectASN1Length(
0);t.expectUint8(Q,0),this.algorithm=t.readASN1OID(),h()>0&&(t.expectUint8(ft,0),
t.expectUint8(0,0)),o(),this.issuer=Ct(t,"issuer"),t.expectUint8(U,0);let[y]=t.expectASN1Length(
0);t.expectUint8(bt,0);let d=t.readASN1UTCTime();t.expectUint8(bt,0);let m=t.readASN1UTCTime();
this.validityPeriod={notBefore:d,notAfter:m},y(),this.subject=Ct(t,"subject");let g=t.
offset;t.expectUint8(U,0);let[A]=t.expectASN1Length(0);t.expectUint8(U,0);let[L,
f]=t.expectASN1Length(0),u=[];for(;f()>0;){let H=t.readUint8();if(H===Q){let z=t.
readASN1OID();u.push(z)}else H===ft&&t.expectUint8(0,0)}L(),t.expectUint8(ut,0);
let x=t.readASN1BitString();this.publicKey={identifiers:u,data:x,all:t.data.subarray(
g,t.offset)},A(),t.expectUint8($t,0);let[T]=t.expectASN1Length();t.expectUint8(U,
0);let[$,P]=t.expectASN1Length(0);for(;P()>0;){t.expectUint8(U,0);let[H,z]=t.expectASN1Length();
t.expectUint8(Q,0);let B=t.readASN1OID();if(B==="2.5.29.17"){t.expectUint8(_,0);
let[k]=t.expectASN1Length(0);t.expectUint8(U,0);let b=Bt(t,W);this.subjectAltNames=
b.filter(C=>C.type===(2|W)).map(C=>C.name),k()}else if(B==="2.5.29.15"){t.expectUint8(
gt,0);let k=t.readASN1Boolean();t.expectUint8(_,0);let[b]=t.expectASN1Length(0);
t.expectUint8(ut,0);let C=t.readASN1BitString(),E=qt(C),I=new Set(ce.filter((w,j)=>E&
1<<j));b(),this.keyUsage={critical:k,usages:I}}else if(B==="2.5.29.37"){this.extKeyUsage=
{},t.expectUint8(_,0);let[k]=t.expectASN1Length(0);t.expectUint8(U,0);let[b,C]=t.
expectASN1Length(0);for(;C()>0;){t.expectUint8(Q,0);let E=t.readASN1OID();E==="1\
.3.6.1.5.5.7.3.1"&&(this.extKeyUsage.serverTls=!0),E==="1.3.6.1.5.5.7.3.2"&&(this.
extKeyUsage.clientTls=!0)}b(),k()}else if(B==="2.5.29.35"){t.expectUint8(_,0);let[
k]=t.expectASN1Length(0);t.expectUint8(U,0);let[b,C]=t.expectASN1Length(0);for(;C()>
0;){let E=t.readUint8();if(E===(W|0)){let[I,w]=t.expectASN1Length(0);this.authorityKeyIdentifier=
t.readBytes(w()),I()}else if(E===(W|1)){let[I,w]=t.expectASN1Length(0);t.skip(w(),
0),I()}else if(E===(W|2)){let[I,w]=t.expectASN1Length(0);t.skip(w(),0),I()}else if(E===
(W|33)){let[I,w]=t.expectASN1Length(0);t.skip(w(),0),I()}else throw new Error(`U\
nexpected data type ${E} in authorityKeyIdentifier certificate extension`)}b(),k()}else if(B===
"2.5.29.14"){t.expectUint8(_,0);let[k]=t.expectASN1Length(0);t.expectUint8(_,0);
let[b,C]=t.expectASN1Length(0);this.subjectKeyIdentifier=t.readBytes(C()),b(),k()}else if(B===
"2.5.29.19"){let k,b=t.readUint8();if(b===gt&&(k=t.readASN1Boolean(),b=t.readUint8()),
b!==_)throw new Error("Unexpected type in certificate basic constraints");let[C]=t.
expectASN1Length(0);t.expectUint8(U,0);let[E,I]=t.expectASN1Length(),w;I()>0&&(t.
expectUint8(gt,0),w=t.readASN1Boolean());let j;if(I()>0){t.expectUint8(tt,0);let J=t.
readASN1Length(0);if(j=J===1?t.readUint8():J===2?t.readUint16():J===3?t.readUint24():
void 0,j===void 0)throw new Error("Too many bytes in max path length in certific\
ate basicConstraints")}E(),C(),this.basicConstraints={critical:k,ca:w,pathLength:j}}else
t.skip(z(),0);H()}$(),T(),a(),this.signedData=t.data.subarray(n,t.offset),t.expectUint8(
U,0);let[q,G]=t.expectASN1Length(0);t.expectUint8(Q,0);let D=t.readASN1OID();if(G()>
0&&(t.expectUint8(ft,0),t.expectUint8(0,0)),q(),D!==this.algorithm)throw new Error(
`Certificate specifies different signature algorithms inside (${this.algorithm})\
 and out (${D})`);t.expectUint8(ut,0),this.signature=t.readASN1BitString(),i()}static fromPEM(e){
let t="[A-Z0-9 ]+",i=new RegExp(`-{5}BEGIN ${t}-{5}([a-zA-Z0-9=+\\/\\n\\r]+)-{5}END\
 ${t}-{5}`,"g"),n=[],a=null;for(;a=i.exec(e);){let c=a[1].replace(/[\r\n]/g,""),
s=Dt(c),o=new this(s);n.push(o)}return n}subjectAltNameMatchingHost(e){let t=/[.][^.]+[.][^.]+$/;
return(this.subjectAltNames??[]).find(i=>{let n=i,a=e;if(t.test(e)&&t.test(n)&&n.
startsWith("*.")&&(n=n.slice(1),a=a.slice(a.indexOf("."))),n===a)return!0})}isValidAtMoment(e=new Date){
return e>=this.validityPeriod.notBefore&&e<=this.validityPeriod.notAfter}description(){
return"subject: "+r.readableDN(this.subject)+(this.subjectAltNames?`
subject alt names: `+this.subjectAltNames.join(", "):"")+(this.subjectKeyIdentifier?
`
subject key id: ${K(this.subjectKeyIdentifier," ")}`:"")+`
issuer: `+r.readableDN(this.issuer)+(this.authorityKeyIdentifier?`
authority key id: ${K(this.authorityKeyIdentifier," ")}`:"")+`
validity: `+this.validityPeriod.notBefore.toISOString()+" \u2013 "+this.validityPeriod.
notAfter.toISOString()+` (${this.isValidAtMoment()?"currently valid":"not valid"}\
)`+(this.keyUsage?`
key usage (${this.keyUsage.critical?"critical":"non-critical"}): `+[...this.keyUsage.
usages].join(", "):"")+(this.extKeyUsage?`
extended key usage: TLS server \u2014\xA0${this.extKeyUsage.serverTls}, TLS clie\
nt \u2014\xA0${this.extKeyUsage.clientTls}`:"")+(this.basicConstraints?`
basic constraints (${this.basicConstraints.critical?"critical":"non-critical"}):\
 CA \u2014\xA0${this.basicConstraints.ca}, path length \u2014 ${this.basicConstraints.
pathLength}`:"")+`
signature algorithm: `+Pt(Ft(this.algorithm))}toJSON(){return{serialNumber:[...this.
serialNumber],algorithm:this.algorithm,issuer:this.issuer,validityPeriod:{notBefore:this.
validityPeriod.notBefore.toISOString(),notAfter:this.validityPeriod.notAfter.toISOString()},
subject:this.subject,publicKey:{identifiers:this.publicKey.identifiers,data:[...this.
publicKey.data],all:[...this.publicKey.all]},signature:[...this.signature],keyUsage:{
critical:this.keyUsage?.critical,usages:[...this.keyUsage?.usages??[]]},subjectAltNames:this.
subjectAltNames,extKeyUsage:this.extKeyUsage,authorityKeyIdentifier:this.authorityKeyIdentifier&&
[...this.authorityKeyIdentifier],subjectKeyIdentifier:this.subjectKeyIdentifier&&
[...this.subjectKeyIdentifier],basicConstraints:this.basicConstraints,signedData:[
...this.signedData]}}},st=class extends X{};async function pt(r,e,t,i,n){r.expectUint8(U,0);let[a]=r.expectASN1Length(0);r.expectUint8(
tt,0);let[c,s]=r.expectASN1Length(0),o=r.readBytes(s());c(),r.expectUint8(tt,0);
let[h,y]=r.expectASN1Length(0),d=r.readBytes(y());h(),a();let m=(u,x)=>u.length>
x?u.subarray(u.length-x):u.length<x?p(new Uint8Array(x-u.length),u):u,g=i==="P-2\
56"?32:48,A=p(m(o,g),m(d,g)),L=await l.importKey("spki",e,{name:"ECDSA",namedCurve:i},
!1,["verify"]);if(await l.verify({name:"ECDSA",hash:n},L,A,t)!==!0)throw new Error(
"ECDSA-SECP256R1-SHA256 certificate verify failed")}async function jt(r,e,t,i=!0,n=!0){for(let h of e);let a=e[0];if(a.subjectAltNameMatchingHost(
r)===void 0)throw new Error(`No matching subjectAltName for ${r}`);if(!a.isValidAtMoment())
throw new Error("End-user certificate is not valid now");if(i&&!a.extKeyUsage?.serverTls)
throw new Error("End-user certificate has no TLS server extKeyUsage");let o=!1;for(let h of t)
;for(let h=0,y=e.length;h<y;h++){let d=e[h],m=d.authorityKeyIdentifier,g;if(m===
void 0?g=t.find(f=>X.distinguishedNamesAreEqual(f.subject,d.issuer)):g=t.find(f=>f.
subjectKeyIdentifier!==void 0&&O(f.subjectKeyIdentifier,m)),g===void 0&&(g=e[h+1]),
g===void 0)throw new Error("Ran out of certificates before reaching trusted root");
let A=g instanceof st;if(g.isValidAtMoment()!==!0)throw new Error("Signing certi\
ficate is not valid now");if(n&&g.keyUsage?.usages.has("digitalSignature")!==!0)
throw new Error("Signing certificate keyUsage does not include digital signature\
s");if(g.basicConstraints?.ca!==!0)throw new Error("Signing certificate basicCon\
straints do not indicate a CA certificate");let{pathLength:L}=g.basicConstraints;
if(L!==void 0&&L<h)throw new Error("Exceeded certificate pathLength");if(d.algorithm===
"1.2.840.10045.4.3.2"||d.algorithm==="1.2.840.10045.4.3.3"){let f=d.algorithm===
"1.2.840.10045.4.3.2"?"SHA-256":"SHA-384",u=g.publicKey.identifiers,x=u.includes(
"1.2.840.10045.3.1.7")?"P-256":u.includes("1.3.132.0.34")?"P-384":void 0;if(x===
void 0)throw new Error("Unsupported signing key curve");let T=new M(d.signature);
await pt(T,g.publicKey.all,d.signedData,x,f)}else if(d.algorithm==="1.2.840.1135\
49.1.1.11"||d.algorithm==="1.2.840.113549.1.1.12"){let f=d.algorithm==="1.2.840.\
113549.1.1.11"?"SHA-256":"SHA-384",u=await l.importKey("spki",g.publicKey.all,{name:"\
RSASSA-PKCS1-v1_5",hash:f},!1,["verify"]);if(await l.verify({name:"RSASSA-PKCS1-\
v1_5"},u,d.signature,d.signedData)!==!0)throw new Error("RSASSA_PKCS1-v1_5-SHA25\
6 certificate verify failed")}else throw new Error("Unsupported signing algorith\
m");if(A){o=!0;break}}return o}var oe=new TextEncoder;async function Vt(r,e,t,i,n,a=!0,c=!0){let s=new M(await e());
s.expectUint8(8,0);let[o]=s.expectLengthUint24(),[h,y]=s.expectLengthUint16(0);for(;y()>
0;){let R=s.readUint16(0);if(R===0)s.expectUint16(0,0);else if(R===10){let[V,F]=s.
expectLengthUint16("groups data");s.skip(F(),0),V()}else throw new Error(`Unsupp\
orted server encrypted extension type 0x${K([R]).padStart(4,"0")}`)}h(),o(),s.remaining()===
0&&s.extend(await e());let d=!1,m=s.readUint8();if(m===13){d=!0;let[R]=s.expectLengthUint24(
"certificate request data");s.expectUint8(0,0);let[V,F]=s.expectLengthUint16("ce\
rtificate request extensions");s.skip(F(),0),V(),R(),s.remaining()===0&&s.extend(
await e()),m=s.readUint8()}if(m!==11)throw new Error(`Unexpected handshake messa\
ge type 0x${K([m])}`);let[g]=s.expectLengthUint24(0);s.expectUint8(0,0);let[A,L]=s.
expectLengthUint24(0),f=[];for(;L()>0;){let[R]=s.expectLengthUint24(0),V=new X(s);
f.push(V),R();let[F,et]=s.expectLengthUint16(),wt=s.subarray(et());F()}if(A(),g(),
f.length===0)throw new Error("No certificates supplied");let u=f[0],x=s.data.subarray(
0,s.offset),T=p(i,x),$=await l.digest("SHA-256",T),P=new Uint8Array($),q=p(oe.encode(
" ".repeat(64)+"TLS 1.3, server CertificateVerify"),[0],P);s.remaining()===0&&s.
extend(await e()),s.expectUint8(15,0);let[G]=s.expectLengthUint24(0),D=s.readUint16();
if(D===1027){let[R]=s.expectLengthUint16();await pt(s,u.publicKey.all,q,"P-256",
"SHA-256"),R()}else if(D===2052){let[R,V]=s.expectLengthUint16(),F=s.subarray(V());
R();let et=await l.importKey("spki",u.publicKey.all,{name:"RSA-PSS",hash:"SHA-25\
6"},!1,["verify"]);if(await l.verify({name:"RSA-PSS",saltLength:32},et,F,q)!==!0)
throw new Error("RSA-PSS-RSAE-SHA256 certificate verify failed")}else throw new Error(
`Unsupported certificate verify signature type 0x${K([D]).padStart(4,"0")}`);G();
let H=s.data.subarray(0,s.offset),z=p(i,H),B=await S(t,"finished",new Uint8Array(
0),32,256),k=await l.digest("SHA-256",z),b=await l.importKey("raw",B,{name:"HMAC",
hash:{name:"SHA-256"}},!1,["sign"]),C=await l.sign("HMAC",b,k),E=new Uint8Array(
C);s.remaining()===0&&s.extend(await e()),s.expectUint8(20,0);let[I,w]=s.expectLengthUint24(
0),j=s.readBytes(w());if(I(),s.remaining()!==0)throw new Error("Unexpected extra\
 bytes in server handshake");if(O(j,E)!==!0)throw new Error("Invalid server veri\
fy hash");if(!await jt(r,f,n,a,c))throw new Error("Validated certificate chain d\
id not end in a trusted root");return[s.data,d]}async function he(r,e,t,i,{useSNI:n,requireServerTlsExtKeyUsage:a,requireDigitalSigKeyUsage:c,
writePreData:s,expectPreData:o,commentPreData:h}={}){n??=!0,a??=!0,c??=!0;let y=await l.
generateKey({name:"ECDH",namedCurve:"P-256"},!0,["deriveKey","deriveBits"]),d=await l.
exportKey("raw",y.publicKey),m=new Uint8Array(32);crypto.getRandomValues(m);let A=St(
r,d,m,n).array(),L=s?p(s,A):A;if(i(L),o){let v=await t(o.length);if(!v||!O(v,o))
throw new Error("Pre data did not match expectation")}let f=await ht(t,22);if(f===
void 0)throw new Error("Connection closed while awaiting server hello");let u=new N(
f.content),x=Ut(u,m),T=await ht(t,20);if(T===void 0)throw new Error("Connection \
closed awaiting server cipher change");let $=new N(T.content),[P]=$.expectLength(
1);$.expectUint8(1,0),P();let q=A.subarray(5),G=f.content,D=p(q,G),H=await Kt(x,
y.privateKey,D,256,16),z=await l.importKey("raw",H.serverHandshakeKey,{name:"AES\
-GCM"},!1,["decrypt"]),B=new Z("decrypt",z,H.serverHandshakeIV),k=await l.importKey(
"raw",H.clientHandshakeKey,{name:"AES-GCM"},!1,["encrypt"]),b=new Z("encrypt",k,
H.clientHandshakeIV),C=async()=>{let v=await dt(t,B,22);if(v===void 0)throw new Error(
"Premature end of encrypted server handshake");return v},[E,I]=await Vt(r,C,H.serverSecret,
D,e,a,c),w=new N(6);w.writeUint8(20,0),w.writeUint16(771,0);let j=w.writeLengthUint16();
w.writeUint8(1,0),j();let J=w.array(),Y=new Uint8Array(0);if(I){let v=new N(8);v.
writeUint8(11,0);let nt=v.writeLengthUint24("client certificate data");v.writeUint8(
0,0),v.writeUint24(0,0),nt(),Y=v.array()}let R=p(D,E,Y),V=await l.digest("SHA-25\
6",R),F=new Uint8Array(V),et=await S(H.clientSecret,"finished",new Uint8Array(0),
32,256),wt=await l.importKey("raw",et,{name:"HMAC",hash:{name:"SHA-256"}},!1,["s\
ign"]),Mt=await l.sign("HMAC",wt,F),_t=new Uint8Array(Mt),at=new N(36);at.writeUint8(
20,0);let Gt=at.writeLengthUint24(0);at.writeBytes(_t),Gt();let zt=at.array(),kt=await At(
p(Y,zt),b,22),Et=F;if(Y.length>0){let v=R.subarray(0,R.length-Y.length),nt=await l.
digest("SHA-256",v);Et=new Uint8Array(nt)}let ct=await Tt(H.handshakeSecret,Et,256,
16),Jt=await l.importKey("raw",ct.clientApplicationKey,{name:"AES-GCM"},!0,["enc\
rypt"]),Zt=new Z("encrypt",Jt,ct.clientApplicationIV),Qt=await l.importKey("raw",
ct.serverApplicationKey,{name:"AES-GCM"},!0,["decrypt"]),Wt=new Z("decrypt",Qt,ct.
serverApplicationIV),ot=!1;return[()=>{if(!ot){let v=p(J,...kt);i(v),ot=!0}return dt(
t,Wt)},async v=>{let nt=ot;ot=!0;let It=await At(v,Zt,23),Xt=nt?p(...It):p(J,...kt,
...It);i(Xt)}]}var xt=class{queue;outstandingRequest;constructor(){this.queue=[]}enqueue(e){this.
queue.push(e),this.dequeue()}dequeue(){if(this.outstandingRequest===void 0)return;
let{resolve:e,bytes:t}=this.outstandingRequest,i=this.bytesInQueue();if(i<t&&this.
socketIsNotClosed())return;if(t=Math.min(t,i),t===0)return e(void 0);this.outstandingRequest=
void 0;let n=this.queue[0],a=n.length;if(a===t)return this.queue.shift(),e(n);if(a>
t)return this.queue[0]=n.subarray(t),e(n.subarray(0,t));{let c=new Uint8Array(t),
s=t,o=0;for(;s>0;){let h=this.queue[0],y=h.length;y<=s?(this.queue.shift(),c.set(
h,o),o+=y,s-=y):(this.queue[0]=h.subarray(s),c.set(h.subarray(0,s),o),s-=s,o+=s)}
return e(c)}}bytesInQueue(){return this.queue.reduce((e,t)=>e+t.length,0)}async read(e){
if(this.outstandingRequest!==void 0)throw new Error("Can\u2019t read while already aw\
aiting read");return new Promise(t=>{this.outstandingRequest={resolve:t,bytes:e},
this.dequeue()})}},vt=class extends xt{constructor(t){super();this.socket=t;t.addEventListener(
"message",i=>this.enqueue(new Uint8Array(i.data))),t.addEventListener("close",()=>this.
dequeue())}socketIsNotClosed(){let{socket:t}=this,{readyState:i}=t;return i<=1}},
Lt=class extends xt{constructor(t){super();this.socket=t;t.on("data",i=>this.enqueue(
new Uint8Array(i))),t.on("close",()=>this.dequeue())}socketIsNotClosed(){let{socket:t}=this,
{readyState:i}=t;return i==="opening"||i==="open"}};export{Lt as SocketReadQueue,st as TrustedCert,vt as WebSocketReadQueue,he as startTls};
