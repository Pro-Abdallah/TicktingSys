module.exports = [
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tracking-buffer/writable-tracking-buffer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
const SHIFT_LEFT_32 = (1 << 16) * (1 << 16);
const SHIFT_RIGHT_32 = 1 / SHIFT_LEFT_32;
const UNKNOWN_PLP_LEN = Buffer.from([
    0xfe,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff,
    0xff
]);
const ZERO_LENGTH_BUFFER = Buffer.alloc(0);
/**
  A Buffer-like class that tracks position.

  As values are written, the position advances by the size of the written data.
  When writing, automatically allocates new buffers if there's not enough space.
 */ class WritableTrackingBuffer {
    constructor(initialSize, encoding, doubleSizeGrowth){
        this.initialSize = initialSize;
        this.encoding = encoding || 'ucs2';
        this.doubleSizeGrowth = doubleSizeGrowth || false;
        this.buffer = Buffer.alloc(this.initialSize, 0);
        this.compositeBuffer = ZERO_LENGTH_BUFFER;
        this.position = 0;
    }
    get data() {
        this.newBuffer(0);
        return this.compositeBuffer;
    }
    copyFrom(buffer) {
        const length = buffer.length;
        this.makeRoomFor(length);
        buffer.copy(this.buffer, this.position);
        this.position += length;
    }
    makeRoomFor(requiredLength) {
        if (this.buffer.length - this.position < requiredLength) {
            if (this.doubleSizeGrowth) {
                let size = Math.max(128, this.buffer.length * 2);
                while(size < requiredLength){
                    size *= 2;
                }
                this.newBuffer(size);
            } else {
                this.newBuffer(requiredLength);
            }
        }
    }
    newBuffer(size) {
        const buffer = this.buffer.slice(0, this.position);
        this.compositeBuffer = Buffer.concat([
            this.compositeBuffer,
            buffer
        ]);
        this.buffer = size === 0 ? ZERO_LENGTH_BUFFER : Buffer.alloc(size, 0);
        this.position = 0;
    }
    writeUInt8(value) {
        const length = 1;
        this.makeRoomFor(length);
        this.buffer.writeUInt8(value, this.position);
        this.position += length;
    }
    writeUInt16LE(value) {
        const length = 2;
        this.makeRoomFor(length);
        this.buffer.writeUInt16LE(value, this.position);
        this.position += length;
    }
    writeUShort(value) {
        this.writeUInt16LE(value);
    }
    writeUInt16BE(value) {
        const length = 2;
        this.makeRoomFor(length);
        this.buffer.writeUInt16BE(value, this.position);
        this.position += length;
    }
    writeUInt24LE(value) {
        const length = 3;
        this.makeRoomFor(length);
        this.buffer[this.position + 2] = value >>> 16 & 0xff;
        this.buffer[this.position + 1] = value >>> 8 & 0xff;
        this.buffer[this.position] = value & 0xff;
        this.position += length;
    }
    writeUInt32LE(value) {
        const length = 4;
        this.makeRoomFor(length);
        this.buffer.writeUInt32LE(value, this.position);
        this.position += length;
    }
    writeBigInt64LE(value) {
        const length = 8;
        this.makeRoomFor(length);
        this.buffer.writeBigInt64LE(value, this.position);
        this.position += length;
    }
    writeInt64LE(value) {
        this.writeBigInt64LE(BigInt(value));
    }
    writeUInt64LE(value) {
        this.writeBigUInt64LE(BigInt(value));
    }
    writeBigUInt64LE(value) {
        const length = 8;
        this.makeRoomFor(length);
        this.buffer.writeBigUInt64LE(value, this.position);
        this.position += length;
    }
    writeUInt32BE(value) {
        const length = 4;
        this.makeRoomFor(length);
        this.buffer.writeUInt32BE(value, this.position);
        this.position += length;
    }
    writeUInt40LE(value) {
        // inspired by https://github.com/dpw/node-buffer-more-ints
        this.writeInt32LE(value & -1);
        this.writeUInt8(Math.floor(value * SHIFT_RIGHT_32));
    }
    writeInt8(value) {
        const length = 1;
        this.makeRoomFor(length);
        this.buffer.writeInt8(value, this.position);
        this.position += length;
    }
    writeInt16LE(value) {
        const length = 2;
        this.makeRoomFor(length);
        this.buffer.writeInt16LE(value, this.position);
        this.position += length;
    }
    writeInt16BE(value) {
        const length = 2;
        this.makeRoomFor(length);
        this.buffer.writeInt16BE(value, this.position);
        this.position += length;
    }
    writeInt32LE(value) {
        const length = 4;
        this.makeRoomFor(length);
        this.buffer.writeInt32LE(value, this.position);
        this.position += length;
    }
    writeInt32BE(value) {
        const length = 4;
        this.makeRoomFor(length);
        this.buffer.writeInt32BE(value, this.position);
        this.position += length;
    }
    writeFloatLE(value) {
        const length = 4;
        this.makeRoomFor(length);
        this.buffer.writeFloatLE(value, this.position);
        this.position += length;
    }
    writeDoubleLE(value) {
        const length = 8;
        this.makeRoomFor(length);
        this.buffer.writeDoubleLE(value, this.position);
        this.position += length;
    }
    writeString(value, encoding) {
        if (encoding == null) {
            encoding = this.encoding;
        }
        const length = Buffer.byteLength(value, encoding);
        this.makeRoomFor(length);
        // $FlowFixMe https://github.com/facebook/flow/pull/5398
        this.buffer.write(value, this.position, encoding);
        this.position += length;
    }
    writeBVarchar(value, encoding) {
        this.writeUInt8(value.length);
        this.writeString(value, encoding);
    }
    writeUsVarchar(value, encoding) {
        this.writeUInt16LE(value.length);
        this.writeString(value, encoding);
    }
    // TODO: Figure out what types are passed in other than `Buffer`
    writeUsVarbyte(value, encoding) {
        if (encoding == null) {
            encoding = this.encoding;
        }
        let length;
        if (value instanceof Buffer) {
            length = value.length;
        } else {
            value = value.toString();
            length = Buffer.byteLength(value, encoding);
        }
        this.writeUInt16LE(length);
        if (value instanceof Buffer) {
            this.writeBuffer(value);
        } else {
            this.makeRoomFor(length);
            // $FlowFixMe https://github.com/facebook/flow/pull/5398
            this.buffer.write(value, this.position, encoding);
            this.position += length;
        }
    }
    writePLPBody(value, encoding) {
        if (encoding == null) {
            encoding = this.encoding;
        }
        let length;
        if (value instanceof Buffer) {
            length = value.length;
        } else {
            value = value.toString();
            length = Buffer.byteLength(value, encoding);
        }
        // Length of all chunks.
        // this.writeUInt64LE(length);
        // unknown seems to work better here - might revisit later.
        this.writeBuffer(UNKNOWN_PLP_LEN);
        // In the UNKNOWN_PLP_LEN case, the data is represented as a series of zero or more chunks.
        if (length > 0) {
            // One chunk.
            this.writeUInt32LE(length);
            if (value instanceof Buffer) {
                this.writeBuffer(value);
            } else {
                this.makeRoomFor(length);
                this.buffer.write(value, this.position, encoding);
                this.position += length;
            }
        }
        // PLP_TERMINATOR (no more chunks).
        this.writeUInt32LE(0);
    }
    writeBuffer(value) {
        const length = value.length;
        this.makeRoomFor(length);
        value.copy(this.buffer, this.position);
        this.position += length;
    }
    writeMoney(value) {
        this.writeInt32LE(Math.floor(value * SHIFT_RIGHT_32));
        this.writeInt32LE(value & -1);
    }
}
var _default = exports.default = WritableTrackingBuffer;
module.exports = WritableTrackingBuffer; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTSElGVF9MRUZUXzMyIiwiU0hJRlRfUklHSFRfMzIiLCJVTktOT1dOX1BMUF9MRU4iLCJCdWZmZXIiLCJmcm9tIiwiWkVST19MRU5HVEhfQlVGRkVSIiwiYWxsb2MiLCJXcml0YWJsZVRyYWNraW5nQnVmZmVyIiwiY29uc3RydWN0b3IiLCJpbml0aWFsU2l6ZSIsImVuY29kaW5nIiwiZG91YmxlU2l6ZUdyb3d0aCIsImJ1ZmZlciIsImNvbXBvc2l0ZUJ1ZmZlciIsInBvc2l0aW9uIiwiZGF0YSIsIm5ld0J1ZmZlciIsImNvcHlGcm9tIiwibGVuZ3RoIiwibWFrZVJvb21Gb3IiLCJjb3B5IiwicmVxdWlyZWRMZW5ndGgiLCJzaXplIiwiTWF0aCIsIm1heCIsInNsaWNlIiwiY29uY2F0Iiwid3JpdGVVSW50OCIsInZhbHVlIiwid3JpdGVVSW50MTZMRSIsIndyaXRlVVNob3J0Iiwid3JpdGVVSW50MTZCRSIsIndyaXRlVUludDI0TEUiLCJ3cml0ZVVJbnQzMkxFIiwid3JpdGVCaWdJbnQ2NExFIiwid3JpdGVJbnQ2NExFIiwiQmlnSW50Iiwid3JpdGVVSW50NjRMRSIsIndyaXRlQmlnVUludDY0TEUiLCJ3cml0ZVVJbnQzMkJFIiwid3JpdGVVSW50NDBMRSIsIndyaXRlSW50MzJMRSIsImZsb29yIiwid3JpdGVJbnQ4Iiwid3JpdGVJbnQxNkxFIiwid3JpdGVJbnQxNkJFIiwid3JpdGVJbnQzMkJFIiwid3JpdGVGbG9hdExFIiwid3JpdGVEb3VibGVMRSIsIndyaXRlU3RyaW5nIiwiYnl0ZUxlbmd0aCIsIndyaXRlIiwid3JpdGVCVmFyY2hhciIsIndyaXRlVXNWYXJjaGFyIiwid3JpdGVVc1ZhcmJ5dGUiLCJ0b1N0cmluZyIsIndyaXRlQnVmZmVyIiwid3JpdGVQTFBCb2R5Iiwid3JpdGVNb25leSIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsImRlZmF1bHQiLCJtb2R1bGUiXSwic291cmNlcyI6WyIuLi8uLi9zcmMvdHJhY2tpbmctYnVmZmVyL3dyaXRhYmxlLXRyYWNraW5nLWJ1ZmZlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBTSElGVF9MRUZUXzMyID0gKDEgPDwgMTYpICogKDEgPDwgMTYpO1xuY29uc3QgU0hJRlRfUklHSFRfMzIgPSAxIC8gU0hJRlRfTEVGVF8zMjtcbmNvbnN0IFVOS05PV05fUExQX0xFTiA9IEJ1ZmZlci5mcm9tKFsweGZlLCAweGZmLCAweGZmLCAweGZmLCAweGZmLCAweGZmLCAweGZmLCAweGZmXSk7XG5jb25zdCBaRVJPX0xFTkdUSF9CVUZGRVIgPSBCdWZmZXIuYWxsb2MoMCk7XG5cbmV4cG9ydCB0eXBlIEVuY29kaW5nID0gJ3V0ZjgnIHwgJ3VjczInIHwgJ2FzY2lpJztcblxuLyoqXG4gIEEgQnVmZmVyLWxpa2UgY2xhc3MgdGhhdCB0cmFja3MgcG9zaXRpb24uXG5cbiAgQXMgdmFsdWVzIGFyZSB3cml0dGVuLCB0aGUgcG9zaXRpb24gYWR2YW5jZXMgYnkgdGhlIHNpemUgb2YgdGhlIHdyaXR0ZW4gZGF0YS5cbiAgV2hlbiB3cml0aW5nLCBhdXRvbWF0aWNhbGx5IGFsbG9jYXRlcyBuZXcgYnVmZmVycyBpZiB0aGVyZSdzIG5vdCBlbm91Z2ggc3BhY2UuXG4gKi9cbmNsYXNzIFdyaXRhYmxlVHJhY2tpbmdCdWZmZXIge1xuICBkZWNsYXJlIGluaXRpYWxTaXplOiBudW1iZXI7XG4gIGRlY2xhcmUgZW5jb2Rpbmc6IEVuY29kaW5nO1xuICBkZWNsYXJlIGRvdWJsZVNpemVHcm93dGg6IGJvb2xlYW47XG5cbiAgZGVjbGFyZSBidWZmZXI6IEJ1ZmZlcjtcbiAgZGVjbGFyZSBjb21wb3NpdGVCdWZmZXI6IEJ1ZmZlcjtcblxuICBkZWNsYXJlIHBvc2l0aW9uOiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoaW5pdGlhbFNpemU6IG51bWJlciwgZW5jb2Rpbmc/OiBFbmNvZGluZyB8IG51bGwsIGRvdWJsZVNpemVHcm93dGg/OiBib29sZWFuKSB7XG4gICAgdGhpcy5pbml0aWFsU2l6ZSA9IGluaXRpYWxTaXplO1xuICAgIHRoaXMuZW5jb2RpbmcgPSBlbmNvZGluZyB8fCAndWNzMic7XG4gICAgdGhpcy5kb3VibGVTaXplR3Jvd3RoID0gZG91YmxlU2l6ZUdyb3d0aCB8fCBmYWxzZTtcbiAgICB0aGlzLmJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyh0aGlzLmluaXRpYWxTaXplLCAwKTtcbiAgICB0aGlzLmNvbXBvc2l0ZUJ1ZmZlciA9IFpFUk9fTEVOR1RIX0JVRkZFUjtcbiAgICB0aGlzLnBvc2l0aW9uID0gMDtcbiAgfVxuXG4gIGdldCBkYXRhKCkge1xuICAgIHRoaXMubmV3QnVmZmVyKDApO1xuICAgIHJldHVybiB0aGlzLmNvbXBvc2l0ZUJ1ZmZlcjtcbiAgfVxuXG4gIGNvcHlGcm9tKGJ1ZmZlcjogQnVmZmVyKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gYnVmZmVyLmxlbmd0aDtcbiAgICB0aGlzLm1ha2VSb29tRm9yKGxlbmd0aCk7XG4gICAgYnVmZmVyLmNvcHkodGhpcy5idWZmZXIsIHRoaXMucG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgbWFrZVJvb21Gb3IocmVxdWlyZWRMZW5ndGg6IG51bWJlcikge1xuICAgIGlmICh0aGlzLmJ1ZmZlci5sZW5ndGggLSB0aGlzLnBvc2l0aW9uIDwgcmVxdWlyZWRMZW5ndGgpIHtcbiAgICAgIGlmICh0aGlzLmRvdWJsZVNpemVHcm93dGgpIHtcbiAgICAgICAgbGV0IHNpemUgPSBNYXRoLm1heCgxMjgsIHRoaXMuYnVmZmVyLmxlbmd0aCAqIDIpO1xuICAgICAgICB3aGlsZSAoc2l6ZSA8IHJlcXVpcmVkTGVuZ3RoKSB7XG4gICAgICAgICAgc2l6ZSAqPSAyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMubmV3QnVmZmVyKHNpemUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5uZXdCdWZmZXIocmVxdWlyZWRMZW5ndGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5ld0J1ZmZlcihzaXplOiBudW1iZXIpIHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlci5zbGljZSgwLCB0aGlzLnBvc2l0aW9uKTtcbiAgICB0aGlzLmNvbXBvc2l0ZUJ1ZmZlciA9IEJ1ZmZlci5jb25jYXQoW3RoaXMuY29tcG9zaXRlQnVmZmVyLCBidWZmZXJdKTtcbiAgICB0aGlzLmJ1ZmZlciA9IChzaXplID09PSAwKSA/IFpFUk9fTEVOR1RIX0JVRkZFUiA6IEJ1ZmZlci5hbGxvYyhzaXplLCAwKTtcbiAgICB0aGlzLnBvc2l0aW9uID0gMDtcbiAgfVxuXG4gIHdyaXRlVUludDgodmFsdWU6IG51bWJlcikge1xuICAgIGNvbnN0IGxlbmd0aCA9IDE7XG4gICAgdGhpcy5tYWtlUm9vbUZvcihsZW5ndGgpO1xuICAgIHRoaXMuYnVmZmVyLndyaXRlVUludDgodmFsdWUsIHRoaXMucG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgd3JpdGVVSW50MTZMRSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gMjtcbiAgICB0aGlzLm1ha2VSb29tRm9yKGxlbmd0aCk7XG4gICAgdGhpcy5idWZmZXIud3JpdGVVSW50MTZMRSh2YWx1ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgdGhpcy5wb3NpdGlvbiArPSBsZW5ndGg7XG4gIH1cblxuICB3cml0ZVVTaG9ydCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy53cml0ZVVJbnQxNkxFKHZhbHVlKTtcbiAgfVxuXG4gIHdyaXRlVUludDE2QkUodmFsdWU6IG51bWJlcikge1xuICAgIGNvbnN0IGxlbmd0aCA9IDI7XG4gICAgdGhpcy5tYWtlUm9vbUZvcihsZW5ndGgpO1xuICAgIHRoaXMuYnVmZmVyLndyaXRlVUludDE2QkUodmFsdWUsIHRoaXMucG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgd3JpdGVVSW50MjRMRSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gMztcbiAgICB0aGlzLm1ha2VSb29tRm9yKGxlbmd0aCk7XG4gICAgdGhpcy5idWZmZXJbdGhpcy5wb3NpdGlvbiArIDJdID0gKHZhbHVlID4+PiAxNikgJiAweGZmO1xuICAgIHRoaXMuYnVmZmVyW3RoaXMucG9zaXRpb24gKyAxXSA9ICh2YWx1ZSA+Pj4gOCkgJiAweGZmO1xuICAgIHRoaXMuYnVmZmVyW3RoaXMucG9zaXRpb25dID0gdmFsdWUgJiAweGZmO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgd3JpdGVVSW50MzJMRSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gNDtcbiAgICB0aGlzLm1ha2VSb29tRm9yKGxlbmd0aCk7XG4gICAgdGhpcy5idWZmZXIud3JpdGVVSW50MzJMRSh2YWx1ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgdGhpcy5wb3NpdGlvbiArPSBsZW5ndGg7XG4gIH1cblxuICB3cml0ZUJpZ0ludDY0TEUodmFsdWU6IGJpZ2ludCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IDg7XG4gICAgdGhpcy5tYWtlUm9vbUZvcihsZW5ndGgpO1xuICAgIHRoaXMuYnVmZmVyLndyaXRlQmlnSW50NjRMRSh2YWx1ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgdGhpcy5wb3NpdGlvbiArPSBsZW5ndGg7XG4gIH1cblxuICB3cml0ZUludDY0TEUodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMud3JpdGVCaWdJbnQ2NExFKEJpZ0ludCh2YWx1ZSkpO1xuICB9XG5cbiAgd3JpdGVVSW50NjRMRSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy53cml0ZUJpZ1VJbnQ2NExFKEJpZ0ludCh2YWx1ZSkpO1xuICB9XG5cbiAgd3JpdGVCaWdVSW50NjRMRSh2YWx1ZTogYmlnaW50KSB7XG4gICAgY29uc3QgbGVuZ3RoID0gODtcbiAgICB0aGlzLm1ha2VSb29tRm9yKGxlbmd0aCk7XG4gICAgdGhpcy5idWZmZXIud3JpdGVCaWdVSW50NjRMRSh2YWx1ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgdGhpcy5wb3NpdGlvbiArPSBsZW5ndGg7XG4gIH1cblxuICB3cml0ZVVJbnQzMkJFKHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBsZW5ndGggPSA0O1xuICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICB0aGlzLmJ1ZmZlci53cml0ZVVJbnQzMkJFKHZhbHVlLCB0aGlzLnBvc2l0aW9uKTtcbiAgICB0aGlzLnBvc2l0aW9uICs9IGxlbmd0aDtcbiAgfVxuXG4gIHdyaXRlVUludDQwTEUodmFsdWU6IG51bWJlcikge1xuICAgIC8vIGluc3BpcmVkIGJ5IGh0dHBzOi8vZ2l0aHViLmNvbS9kcHcvbm9kZS1idWZmZXItbW9yZS1pbnRzXG4gICAgdGhpcy53cml0ZUludDMyTEUodmFsdWUgJiAtMSk7XG4gICAgdGhpcy53cml0ZVVJbnQ4KE1hdGguZmxvb3IodmFsdWUgKiBTSElGVF9SSUdIVF8zMikpO1xuICB9XG5cbiAgd3JpdGVJbnQ4KHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBsZW5ndGggPSAxO1xuICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICB0aGlzLmJ1ZmZlci53cml0ZUludDgodmFsdWUsIHRoaXMucG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgd3JpdGVJbnQxNkxFKHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBsZW5ndGggPSAyO1xuICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICB0aGlzLmJ1ZmZlci53cml0ZUludDE2TEUodmFsdWUsIHRoaXMucG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgd3JpdGVJbnQxNkJFKHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBsZW5ndGggPSAyO1xuICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICB0aGlzLmJ1ZmZlci53cml0ZUludDE2QkUodmFsdWUsIHRoaXMucG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgd3JpdGVJbnQzMkxFKHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBsZW5ndGggPSA0O1xuICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICB0aGlzLmJ1ZmZlci53cml0ZUludDMyTEUodmFsdWUsIHRoaXMucG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgd3JpdGVJbnQzMkJFKHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBsZW5ndGggPSA0O1xuICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICB0aGlzLmJ1ZmZlci53cml0ZUludDMyQkUodmFsdWUsIHRoaXMucG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgd3JpdGVGbG9hdExFKHZhbHVlOiBudW1iZXIpIHtcbiAgICBjb25zdCBsZW5ndGggPSA0O1xuICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICB0aGlzLmJ1ZmZlci53cml0ZUZsb2F0TEUodmFsdWUsIHRoaXMucG9zaXRpb24pO1xuICAgIHRoaXMucG9zaXRpb24gKz0gbGVuZ3RoO1xuICB9XG5cbiAgd3JpdGVEb3VibGVMRSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gODtcbiAgICB0aGlzLm1ha2VSb29tRm9yKGxlbmd0aCk7XG4gICAgdGhpcy5idWZmZXIud3JpdGVEb3VibGVMRSh2YWx1ZSwgdGhpcy5wb3NpdGlvbik7XG4gICAgdGhpcy5wb3NpdGlvbiArPSBsZW5ndGg7XG4gIH1cblxuICB3cml0ZVN0cmluZyh2YWx1ZTogc3RyaW5nLCBlbmNvZGluZz86IEVuY29kaW5nIHwgbnVsbCkge1xuICAgIGlmIChlbmNvZGluZyA9PSBudWxsKSB7XG4gICAgICBlbmNvZGluZyA9IHRoaXMuZW5jb2Rpbmc7XG4gICAgfVxuXG4gICAgY29uc3QgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgodmFsdWUsIGVuY29kaW5nKTtcbiAgICB0aGlzLm1ha2VSb29tRm9yKGxlbmd0aCk7XG5cbiAgICAvLyAkRmxvd0ZpeE1lIGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9vay9mbG93L3B1bGwvNTM5OFxuICAgIHRoaXMuYnVmZmVyLndyaXRlKHZhbHVlLCB0aGlzLnBvc2l0aW9uLCBlbmNvZGluZyk7XG4gICAgdGhpcy5wb3NpdGlvbiArPSBsZW5ndGg7XG4gIH1cblxuICB3cml0ZUJWYXJjaGFyKHZhbHVlOiBzdHJpbmcsIGVuY29kaW5nPzogRW5jb2RpbmcgfCBudWxsKSB7XG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLmxlbmd0aCk7XG4gICAgdGhpcy53cml0ZVN0cmluZyh2YWx1ZSwgZW5jb2RpbmcpO1xuICB9XG5cbiAgd3JpdGVVc1ZhcmNoYXIodmFsdWU6IHN0cmluZywgZW5jb2Rpbmc/OiBFbmNvZGluZyB8IG51bGwpIHtcbiAgICB0aGlzLndyaXRlVUludDE2TEUodmFsdWUubGVuZ3RoKTtcbiAgICB0aGlzLndyaXRlU3RyaW5nKHZhbHVlLCBlbmNvZGluZyk7XG4gIH1cblxuICAvLyBUT0RPOiBGaWd1cmUgb3V0IHdoYXQgdHlwZXMgYXJlIHBhc3NlZCBpbiBvdGhlciB0aGFuIGBCdWZmZXJgXG4gIHdyaXRlVXNWYXJieXRlKHZhbHVlOiBhbnksIGVuY29kaW5nPzogRW5jb2RpbmcgfCBudWxsKSB7XG4gICAgaWYgKGVuY29kaW5nID09IG51bGwpIHtcbiAgICAgIGVuY29kaW5nID0gdGhpcy5lbmNvZGluZztcbiAgICB9XG5cbiAgICBsZXQgbGVuZ3RoO1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aCh2YWx1ZSwgZW5jb2RpbmcpO1xuICAgIH1cbiAgICB0aGlzLndyaXRlVUludDE2TEUobGVuZ3RoKTtcblxuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgdGhpcy53cml0ZUJ1ZmZlcih2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICAgIC8vICRGbG93Rml4TWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL2Zsb3cvcHVsbC81Mzk4XG4gICAgICB0aGlzLmJ1ZmZlci53cml0ZSh2YWx1ZSwgdGhpcy5wb3NpdGlvbiwgZW5jb2RpbmcpO1xuICAgICAgdGhpcy5wb3NpdGlvbiArPSBsZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgd3JpdGVQTFBCb2R5KHZhbHVlOiBhbnksIGVuY29kaW5nPzogRW5jb2RpbmcgfCBudWxsKSB7XG4gICAgaWYgKGVuY29kaW5nID09IG51bGwpIHtcbiAgICAgIGVuY29kaW5nID0gdGhpcy5lbmNvZGluZztcbiAgICB9XG5cbiAgICBsZXQgbGVuZ3RoO1xuICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aCh2YWx1ZSwgZW5jb2RpbmcpO1xuICAgIH1cblxuICAgIC8vIExlbmd0aCBvZiBhbGwgY2h1bmtzLlxuICAgIC8vIHRoaXMud3JpdGVVSW50NjRMRShsZW5ndGgpO1xuICAgIC8vIHVua25vd24gc2VlbXMgdG8gd29yayBiZXR0ZXIgaGVyZSAtIG1pZ2h0IHJldmlzaXQgbGF0ZXIuXG4gICAgdGhpcy53cml0ZUJ1ZmZlcihVTktOT1dOX1BMUF9MRU4pO1xuXG4gICAgLy8gSW4gdGhlIFVOS05PV05fUExQX0xFTiBjYXNlLCB0aGUgZGF0YSBpcyByZXByZXNlbnRlZCBhcyBhIHNlcmllcyBvZiB6ZXJvIG9yIG1vcmUgY2h1bmtzLlxuICAgIGlmIChsZW5ndGggPiAwKSB7XG4gICAgICAvLyBPbmUgY2h1bmsuXG4gICAgICB0aGlzLndyaXRlVUludDMyTEUobGVuZ3RoKTtcbiAgICAgIGlmICh2YWx1ZSBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgICB0aGlzLndyaXRlQnVmZmVyKHZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICAgICAgdGhpcy5idWZmZXIud3JpdGUodmFsdWUsIHRoaXMucG9zaXRpb24sIGVuY29kaW5nKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiArPSBsZW5ndGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUExQX1RFUk1JTkFUT1IgKG5vIG1vcmUgY2h1bmtzKS5cbiAgICB0aGlzLndyaXRlVUludDMyTEUoMCk7XG4gIH1cblxuICB3cml0ZUJ1ZmZlcih2YWx1ZTogQnVmZmVyKSB7XG4gICAgY29uc3QgbGVuZ3RoID0gdmFsdWUubGVuZ3RoO1xuICAgIHRoaXMubWFrZVJvb21Gb3IobGVuZ3RoKTtcbiAgICB2YWx1ZS5jb3B5KHRoaXMuYnVmZmVyLCB0aGlzLnBvc2l0aW9uKTtcbiAgICB0aGlzLnBvc2l0aW9uICs9IGxlbmd0aDtcbiAgfVxuXG4gIHdyaXRlTW9uZXkodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMud3JpdGVJbnQzMkxFKE1hdGguZmxvb3IodmFsdWUgKiBTSElGVF9SSUdIVF8zMikpO1xuICAgIHRoaXMud3JpdGVJbnQzMkxFKHZhbHVlICYgLTEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFdyaXRhYmxlVHJhY2tpbmdCdWZmZXI7XG5tb2R1bGUuZXhwb3J0cyA9IFdyaXRhYmxlVHJhY2tpbmdCdWZmZXI7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE1BQU1BLGFBQWEsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUs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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/bulk-load.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _events = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
var _writableTrackingBuffer = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tracking-buffer/writable-tracking-buffer.js [app-route] (ecmascript)"));
var _stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var _token = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/token/token.js [app-route] (ecmascript)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
/**
 * @private
 */ const FLAGS = {
    nullable: 1 << 0,
    caseSen: 1 << 1,
    updateableReadWrite: 1 << 2,
    updateableUnknown: 1 << 3,
    identity: 1 << 4,
    computed: 1 << 5,
    // introduced in TDS 7.2
    fixedLenCLRType: 1 << 8,
    // introduced in TDS 7.2
    sparseColumnSet: 1 << 10,
    // introduced in TDS 7.3.B
    hidden: 1 << 13,
    // introduced in TDS 7.2
    key: 1 << 14,
    // introduced in TDS 7.2
    nullableUnknown: 1 << 15 // introduced in TDS 7.2
};
/**
 * @private
 */ const DONE_STATUS = {
    FINAL: 0x00,
    MORE: 0x1,
    ERROR: 0x2,
    INXACT: 0x4,
    COUNT: 0x10,
    ATTN: 0x20,
    SRVERROR: 0x100
};
/**
 * @private
 */ const rowTokenBuffer = Buffer.from([
    _token.TYPE.ROW
]);
const textPointerAndTimestampBuffer = Buffer.from([
    // TextPointer length
    0x10,
    // TextPointer
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    // Timestamp
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00
]);
const textPointerNullBuffer = Buffer.from([
    0x00
]);
// A transform that converts rows to packets.
class RowTransform extends _stream.Transform {
    /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ constructor(bulkLoad){
        super({
            writableObjectMode: true
        });
        this.bulkLoad = bulkLoad;
        this.mainOptions = bulkLoad.options;
        this.columns = bulkLoad.columns;
        this.columnMetadataWritten = false;
    }
    /**
   * @private
   */ _transform(row, _encoding, callback) {
        if (!this.columnMetadataWritten) {
            this.push(this.bulkLoad.getColMetaData());
            this.columnMetadataWritten = true;
        }
        this.push(rowTokenBuffer);
        for(let i = 0; i < this.columns.length; i++){
            const c = this.columns[i];
            let value = Array.isArray(row) ? row[i] : row[c.objName];
            if (!this.bulkLoad.firstRowWritten) {
                try {
                    value = c.type.validate(value, c.collation);
                } catch (error) {
                    return callback(error);
                }
            }
            const parameter = {
                length: c.length,
                scale: c.scale,
                precision: c.precision,
                value: value
            };
            if (c.type.name === 'Text' || c.type.name === 'Image' || c.type.name === 'NText') {
                if (value == null) {
                    this.push(textPointerNullBuffer);
                    continue;
                }
                this.push(textPointerAndTimestampBuffer);
            }
            try {
                this.push(c.type.generateParameterLength(parameter, this.mainOptions));
                for (const chunk of c.type.generateParameterData(parameter, this.mainOptions)){
                    this.push(chunk);
                }
            } catch (error) {
                return callback(error);
            }
        }
        process.nextTick(callback);
    }
    /**
   * @private
   */ _flush(callback) {
        this.push(this.bulkLoad.createDoneToken());
        process.nextTick(callback);
    }
}
/**
 * A BulkLoad instance is used to perform a bulk insert.
 *
 * Use [[Connection.newBulkLoad]] to create a new instance, and [[Connection.execBulkLoad]] to execute it.
 *
 * Example of BulkLoad Usages:
 *
 * ```js
 * // optional BulkLoad options
 * const options = { keepNulls: true };
 *
 * // instantiate - provide the table where you'll be inserting to, options and a callback
 * const bulkLoad = connection.newBulkLoad('MyTable', options, (error, rowCount) => {
 *   console.log('inserted %d rows', rowCount);
 * });
 *
 * // setup your columns - always indicate whether the column is nullable
 * bulkLoad.addColumn('myInt', TYPES.Int, { nullable: false });
 * bulkLoad.addColumn('myString', TYPES.NVarChar, { length: 50, nullable: true });
 *
 * // execute
 * connection.execBulkLoad(bulkLoad, [
 *   { myInt: 7, myString: 'hello' },
 *   { myInt: 23, myString: 'world' }
 * ]);
 * ```
 */ class BulkLoad extends _events.EventEmitter {
    /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ constructor(table, collation, connectionOptions, { checkConstraints = false, fireTriggers = false, keepNulls = false, lockTable = false, order = {} }, callback){
        if (typeof checkConstraints !== 'boolean') {
            throw new TypeError('The "options.checkConstraints" property must be of type boolean.');
        }
        if (typeof fireTriggers !== 'boolean') {
            throw new TypeError('The "options.fireTriggers" property must be of type boolean.');
        }
        if (typeof keepNulls !== 'boolean') {
            throw new TypeError('The "options.keepNulls" property must be of type boolean.');
        }
        if (typeof lockTable !== 'boolean') {
            throw new TypeError('The "options.lockTable" property must be of type boolean.');
        }
        if (typeof order !== 'object' || order === null) {
            throw new TypeError('The "options.order" property must be of type object.');
        }
        for (const [column, direction] of Object.entries(order)){
            if (direction !== 'ASC' && direction !== 'DESC') {
                throw new TypeError('The value of the "' + column + '" key in the "options.order" object must be either "ASC" or "DESC".');
            }
        }
        super();
        this.error = undefined;
        this.canceled = false;
        this.executionStarted = false;
        this.collation = collation;
        this.table = table;
        this.options = connectionOptions;
        this.callback = callback;
        this.columns = [];
        this.columnsByName = {};
        this.firstRowWritten = false;
        this.streamingMode = false;
        this.rowToPacketTransform = new RowTransform(this);
        this.bulkOptions = {
            checkConstraints,
            fireTriggers,
            keepNulls,
            lockTable,
            order
        };
    }
    /**
   * Adds a column to the bulk load.
   *
   * The column definitions should match the table you are trying to insert into.
   * Attempting to call addColumn after the first row has been added will throw an exception.
   *
   * ```js
   * bulkLoad.addColumn('MyIntColumn', TYPES.Int, { nullable: false });
   * ```
   *
   * @param name The name of the column.
   * @param type One of the supported `data types`.
   * @param __namedParameters Additional column type information. At a minimum, `nullable` must be set to true or false.
   * @param length For VarChar, NVarChar, VarBinary. Use length as `Infinity` for VarChar(max), NVarChar(max) and VarBinary(max).
   * @param nullable Indicates whether the column accepts NULL values.
   * @param objName If the name of the column is different from the name of the property found on `rowObj` arguments passed to [[addRow]] or [[Connection.execBulkLoad]], then you can use this option to specify the property name.
   * @param precision For Numeric, Decimal.
   * @param scale For Numeric, Decimal, Time, DateTime2, DateTimeOffset.
  */ addColumn(name, type, { output = false, length, precision, scale, objName = name, nullable = true }) {
        if (this.firstRowWritten) {
            throw new Error('Columns cannot be added to bulk insert after the first row has been written.');
        }
        if (this.executionStarted) {
            throw new Error('Columns cannot be added to bulk insert after execution has started.');
        }
        const column = {
            type: type,
            name: name,
            value: null,
            output: output,
            length: length,
            precision: precision,
            scale: scale,
            objName: objName,
            nullable: nullable,
            collation: this.collation
        };
        if ((type.id & 0x30) === 0x20) {
            if (column.length == null && type.resolveLength) {
                column.length = type.resolveLength(column);
            }
        }
        if (type.resolvePrecision && column.precision == null) {
            column.precision = type.resolvePrecision(column);
        }
        if (type.resolveScale && column.scale == null) {
            column.scale = type.resolveScale(column);
        }
        this.columns.push(column);
        this.columnsByName[name] = column;
    }
    /**
   * @private
   */ getOptionsSql() {
        const addOptions = [];
        if (this.bulkOptions.checkConstraints) {
            addOptions.push('CHECK_CONSTRAINTS');
        }
        if (this.bulkOptions.fireTriggers) {
            addOptions.push('FIRE_TRIGGERS');
        }
        if (this.bulkOptions.keepNulls) {
            addOptions.push('KEEP_NULLS');
        }
        if (this.bulkOptions.lockTable) {
            addOptions.push('TABLOCK');
        }
        if (this.bulkOptions.order) {
            const orderColumns = [];
            for (const [column, direction] of Object.entries(this.bulkOptions.order)){
                orderColumns.push(`${column} ${direction}`);
            }
            if (orderColumns.length) {
                addOptions.push(`ORDER (${orderColumns.join(', ')})`);
            }
        }
        if (addOptions.length > 0) {
            return ` WITH (${addOptions.join(',')})`;
        } else {
            return '';
        }
    }
    /**
   * @private
   */ getBulkInsertSql() {
        let sql = 'insert bulk ' + this.table + '(';
        for(let i = 0, len = this.columns.length; i < len; i++){
            const c = this.columns[i];
            if (i !== 0) {
                sql += ', ';
            }
            sql += '[' + c.name + '] ' + c.type.declaration(c);
        }
        sql += ')';
        sql += this.getOptionsSql();
        return sql;
    }
    /**
   * This is simply a helper utility function which returns a `CREATE TABLE SQL` statement based on the columns added to the bulkLoad object.
   * This may be particularly handy when you want to insert into a temporary table (a table which starts with `#`).
   *
   * ```js
   * var sql = bulkLoad.getTableCreationSql();
   * ```
   *
   * A side note on bulk inserting into temporary tables: if you want to access a local temporary table after executing the bulk load,
   * you'll need to use the same connection and execute your requests using [[Connection.execSqlBatch]] instead of [[Connection.execSql]]
   */ getTableCreationSql() {
        let sql = 'CREATE TABLE ' + this.table + '(\n';
        for(let i = 0, len = this.columns.length; i < len; i++){
            const c = this.columns[i];
            if (i !== 0) {
                sql += ',\n';
            }
            sql += '[' + c.name + '] ' + c.type.declaration(c);
            if (c.nullable !== undefined) {
                sql += ' ' + (c.nullable ? 'NULL' : 'NOT NULL');
            }
        }
        sql += '\n)';
        return sql;
    }
    /**
   * @private
   */ getColMetaData() {
        const tBuf = new _writableTrackingBuffer.default(100, null, true);
        // TokenType
        tBuf.writeUInt8(_token.TYPE.COLMETADATA);
        // Count
        tBuf.writeUInt16LE(this.columns.length);
        for(let j = 0, len = this.columns.length; j < len; j++){
            const c = this.columns[j];
            // UserType
            if (this.options.tdsVersion < '7_2') {
                tBuf.writeUInt16LE(0);
            } else {
                tBuf.writeUInt32LE(0);
            }
            // Flags
            let flags = FLAGS.updateableReadWrite;
            if (c.nullable) {
                flags |= FLAGS.nullable;
            } else if (c.nullable === undefined && this.options.tdsVersion >= '7_2') {
                flags |= FLAGS.nullableUnknown;
            }
            tBuf.writeUInt16LE(flags);
            // TYPE_INFO
            tBuf.writeBuffer(c.type.generateTypeInfo(c, this.options));
            // TableName
            if (c.type.hasTableName) {
                tBuf.writeUsVarchar(this.table, 'ucs2');
            }
            // ColName
            tBuf.writeBVarchar(c.name, 'ucs2');
        }
        return tBuf.data;
    }
    /**
   * Sets a timeout for this bulk load.
   *
   * ```js
   * bulkLoad.setTimeout(timeout);
   * ```
   *
   * @param timeout The number of milliseconds before the bulk load is considered failed, or 0 for no timeout.
   *   When no timeout is set for the bulk load, the [[ConnectionOptions.requestTimeout]] of the Connection is used.
   */ setTimeout(timeout) {
        this.timeout = timeout;
    }
    /**
   * @private
   */ createDoneToken() {
        // It might be nice to make DoneToken a class if anything needs to create them, but for now, just do it here
        const tBuf = new _writableTrackingBuffer.default(this.options.tdsVersion < '7_2' ? 9 : 13);
        tBuf.writeUInt8(_token.TYPE.DONE);
        const status = DONE_STATUS.FINAL;
        tBuf.writeUInt16LE(status);
        tBuf.writeUInt16LE(0); // CurCmd (TDS ignores this)
        tBuf.writeUInt32LE(0); // row count - doesn't really matter
        if (this.options.tdsVersion >= '7_2') {
            tBuf.writeUInt32LE(0); // row count is 64 bits in >= TDS 7.2
        }
        return tBuf.data;
    }
    /**
   * @private
   */ cancel() {
        if (this.canceled) {
            return;
        }
        this.canceled = true;
        this.emit('cancel');
    }
}
var _default = exports.default = BulkLoad;
module.exports = BulkLoad; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRzIiwicmVxdWlyZSIsIl93cml0YWJsZVRyYWNraW5nQnVmZmVyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9zdHJlYW0iLCJfdG9rZW4iLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJGTEFHUyIsIm51bGxhYmxlIiwiY2FzZVNlbiIsInVwZGF0ZWFibGVSZWFkV3JpdGUiLCJ1cGRhdGVhYmxlVW5rbm93biIsImlkZW50aXR5IiwiY29tcHV0ZWQiLCJmaXhlZExlbkNMUlR5cGUiLCJzcGFyc2VDb2x1bW5TZXQiLCJoaWRkZW4iLCJrZXkiLCJudWxsYWJsZVVua25vd24iLCJET05FX1NUQVRVUyIsIkZJTkFMIiwiTU9SRSIsIkVSUk9SIiwiSU5YQUNUIiwiQ09VTlQiLCJBVFROIiwiU1JWRVJST1IiLCJyb3dUb2tlbkJ1ZmZlciIsIkJ1ZmZlciIsImZyb20iLCJUT0tFTl9UWVBFIiwiUk9XIiwidGV4dFBvaW50ZXJBbmRUaW1lc3RhbXBCdWZmZXIiLCJ0ZXh0UG9pbnRlck51bGxCdWZmZXIiLCJSb3dUcmFuc2Zvcm0iLCJUcmFuc2Zvcm0iLCJjb25zdHJ1Y3RvciIsImJ1bGtMb2FkIiwid3JpdGFibGVPYmplY3RNb2RlIiwibWFpbk9wdGlvbnMiLCJvcHRpb25zIiwiY29sdW1ucyIsImNvbHVtbk1ldGFkYXRhV3JpdHRlbiIsIl90cmFuc2Zvcm0iLCJyb3ciLCJfZW5jb2RpbmciLCJjYWxsYmFjayIsInB1c2giLCJnZXRDb2xNZXRhRGF0YSIsImkiLCJsZW5ndGgiLCJjIiwidmFsdWUiLCJBcnJheSIsImlzQXJyYXkiLCJvYmpOYW1lIiwiZmlyc3RSb3dXcml0dGVuIiwidHlwZSIsInZhbGlkYXRlIiwiY29sbGF0aW9uIiwiZXJyb3IiLCJwYXJhbWV0ZXIiLCJzY2FsZSIsInByZWNpc2lvbiIsIm5hbWUiLCJnZW5lcmF0ZVBhcmFtZXRlckxlbmd0aCIsImNodW5rIiwiZ2VuZXJhdGVQYXJhbWV0ZXJEYXRhIiwicHJvY2VzcyIsIm5leHRUaWNrIiwiX2ZsdXNoIiwiY3JlYXRlRG9uZVRva2VuIiwiQnVsa0xvYWQiLCJFdmVudEVtaXR0ZXIiLCJ0YWJsZSIsImNvbm5lY3Rpb25PcHRpb25zIiwiY2hlY2tDb25zdHJhaW50cyIsImZpcmVUcmlnZ2VycyIsImtlZXBOdWxscyIsImxvY2tUYWJsZSIsIm9yZGVyIiwiVHlwZUVycm9yIiwiY29sdW1uIiwiZGlyZWN0aW9uIiwiT2JqZWN0IiwiZW50cmllcyIsInVuZGVmaW5lZCIsImNhbmNlbGVkIiwiZXhlY3V0aW9uU3RhcnRlZCIsImNvbHVtbnNCeU5hbWUiLCJzdHJlYW1pbmdNb2RlIiwicm93VG9QYWNrZXRUcmFuc2Zvcm0iLCJidWxrT3B0aW9ucyIsImFkZENvbHVtbiIsIm91dHB1dCIsIkVycm9yIiwiaWQiLCJyZXNvbHZlTGVuZ3RoIiwicmVzb2x2ZVByZWNpc2lvbiIsInJlc29sdmVTY2FsZSIsImdldE9wdGlvbnNTcWwiLCJhZGRPcHRpb25zIiwib3JkZXJDb2x1bW5zIiwiam9pbiIsImdldEJ1bGtJbnNlcnRTcWwiLCJzcWwiLCJsZW4iLCJkZWNsYXJhdGlvbiIsImdldFRhYmxlQ3JlYXRpb25TcWwiLCJ0QnVmIiwiV3JpdGFibGVUcmFja2luZ0J1ZmZlciIsIndyaXRlVUludDgiLCJDT0xNRVRBREFUQSIsIndyaXRlVUludDE2TEUiLCJqIiwidGRzVmVyc2lvbiIsIndyaXRlVUludDMyTEUiLCJmbGFncyIsIndyaXRlQnVmZmVyIiwiZ2VuZXJhdGVUeXBlSW5mbyIsImhhc1RhYmxlTmFtZSIsIndyaXRlVXNWYXJjaGFyIiwid3JpdGVCVmFyY2hhciIsImRhdGEiLCJzZXRUaW1lb3V0IiwidGltZW91dCIsIkRPTkUiLCJzdGF0dXMiLCJjYW5jZWwiLCJlbWl0IiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIl0sInNvdXJjZXMiOlsiLi4vc3JjL2J1bGstbG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuaW1wb3J0IFdyaXRhYmxlVHJhY2tpbmdCdWZmZXIgZnJvbSAnLi90cmFja2luZy1idWZmZXIvd3JpdGFibGUtdHJhY2tpbmctYnVmZmVyJztcbmltcG9ydCBDb25uZWN0aW9uLCB7IHR5cGUgSW50ZXJuYWxDb25uZWN0aW9uT3B0aW9ucyB9IGZyb20gJy4vY29ubmVjdGlvbic7XG5cbmltcG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gJ3N0cmVhbSc7XG5pbXBvcnQgeyBUWVBFIGFzIFRPS0VOX1RZUEUgfSBmcm9tICcuL3Rva2VuL3Rva2VuJztcblxuaW1wb3J0IHsgdHlwZSBEYXRhVHlwZSwgdHlwZSBQYXJhbWV0ZXIgfSBmcm9tICcuL2RhdGEtdHlwZSc7XG5pbXBvcnQgeyBDb2xsYXRpb24gfSBmcm9tICcuL2NvbGxhdGlvbic7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgRkxBR1MgPSB7XG4gIG51bGxhYmxlOiAxIDw8IDAsXG4gIGNhc2VTZW46IDEgPDwgMSxcbiAgdXBkYXRlYWJsZVJlYWRXcml0ZTogMSA8PCAyLFxuICB1cGRhdGVhYmxlVW5rbm93bjogMSA8PCAzLFxuICBpZGVudGl0eTogMSA8PCA0LFxuICBjb21wdXRlZDogMSA8PCA1LCAvLyBpbnRyb2R1Y2VkIGluIFREUyA3LjJcbiAgZml4ZWRMZW5DTFJUeXBlOiAxIDw8IDgsIC8vIGludHJvZHVjZWQgaW4gVERTIDcuMlxuICBzcGFyc2VDb2x1bW5TZXQ6IDEgPDwgMTAsIC8vIGludHJvZHVjZWQgaW4gVERTIDcuMy5CXG4gIGhpZGRlbjogMSA8PCAxMywgLy8gaW50cm9kdWNlZCBpbiBURFMgNy4yXG4gIGtleTogMSA8PCAxNCwgLy8gaW50cm9kdWNlZCBpbiBURFMgNy4yXG4gIG51bGxhYmxlVW5rbm93bjogMSA8PCAxNSAvLyBpbnRyb2R1Y2VkIGluIFREUyA3LjJcbn07XG5cbi8qKlxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgRE9ORV9TVEFUVVMgPSB7XG4gIEZJTkFMOiAweDAwLFxuICBNT1JFOiAweDEsXG4gIEVSUk9SOiAweDIsXG4gIElOWEFDVDogMHg0LFxuICBDT1VOVDogMHgxMCxcbiAgQVRUTjogMHgyMCxcbiAgU1JWRVJST1I6IDB4MTAwXG59O1xuXG4vKipcbiAqIEBwcml2YXRlXG4gKi9cbmludGVyZmFjZSBJbnRlcm5hbE9wdGlvbnMge1xuICBjaGVja0NvbnN0cmFpbnRzOiBib29sZWFuO1xuICBmaXJlVHJpZ2dlcnM6IGJvb2xlYW47XG4gIGtlZXBOdWxsczogYm9vbGVhbjtcbiAgbG9ja1RhYmxlOiBib29sZWFuO1xuICBvcmRlcjogeyBbY29sdW1uTmFtZTogc3RyaW5nXTogJ0FTQycgfCAnREVTQycgfTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBPcHRpb25zIHtcbiAgLyoqXG4gICAqIEhvbm9ycyBjb25zdHJhaW50cyBkdXJpbmcgYnVsayBsb2FkLCB1c2luZyBULVNRTFxuICAgKiBbQ0hFQ0tfQ09OU1RSQUlOVFNdKGh0dHBzOi8vdGVjaG5ldC5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXMxODYyNDcodj1zcWwuMTA1KS5hc3B4KS5cbiAgICogKGRlZmF1bHQ6IGBmYWxzZWApXG4gICAqL1xuICBjaGVja0NvbnN0cmFpbnRzPzogSW50ZXJuYWxPcHRpb25zWydjaGVja0NvbnN0cmFpbnRzJ10gfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEhvbm9ycyBpbnNlcnQgdHJpZ2dlcnMgZHVyaW5nIGJ1bGsgbG9hZCwgdXNpbmcgdGhlIFQtU1FMIFtGSVJFX1RSSUdHRVJTXShodHRwczovL3RlY2huZXQubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zMTg3NjQwKHY9c3FsLjEwNSkuYXNweCkuIChkZWZhdWx0OiBgZmFsc2VgKVxuICAgKi9cbiAgZmlyZVRyaWdnZXJzPzogSW50ZXJuYWxPcHRpb25zWydmaXJlVHJpZ2dlcnMnXSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogSG9ub3JzIG51bGwgdmFsdWUgcGFzc2VkLCBpZ25vcmVzIHRoZSBkZWZhdWx0IHZhbHVlcyBzZXQgb24gdGFibGUsIHVzaW5nIFQtU1FMIFtLRUVQX05VTExTXShodHRwczovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zMTg3ODg3KHY9c3FsLjEyMCkuYXNweCkuIChkZWZhdWx0OiBgZmFsc2VgKVxuICAgKi9cbiAga2VlcE51bGxzPzogSW50ZXJuYWxPcHRpb25zWydrZWVwTnVsbHMnXSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogUGxhY2VzIGEgYnVsayB1cGRhdGUoQlUpIGxvY2sgb24gdGFibGUgd2hpbGUgcGVyZm9ybWluZyBidWxrIGxvYWQsIHVzaW5nIFQtU1FMIFtUQUJMT0NLXShodHRwczovL3RlY2huZXQubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L21zMTgwODc2KHY9c3FsLjEwNSkuYXNweCkuIChkZWZhdWx0OiBgZmFsc2VgKVxuICAgKi9cbiAgbG9ja1RhYmxlPzogSW50ZXJuYWxPcHRpb25zWydsb2NrVGFibGUnXSB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBvcmRlcmluZyBvZiB0aGUgZGF0YSB0byBwb3NzaWJseSBpbmNyZWFzZSBidWxrIGluc2VydCBwZXJmb3JtYW5jZSwgdXNpbmcgVC1TUUwgW09SREVSXShodHRwczovL2RvY3MubWljcm9zb2Z0LmNvbS9lbi11cy9wcmV2aW91cy12ZXJzaW9ucy9zcWwvc3FsLXNlcnZlci0yMDA4LXIyL21zMTc3NDY4KHY9c3FsLjEwNSkpLiAoZGVmYXVsdDogYHt9YClcbiAgICovXG4gIG9yZGVyPzogSW50ZXJuYWxPcHRpb25zWydvcmRlciddIHwgdW5kZWZpbmVkO1xufVxuXG5cbmV4cG9ydCB0eXBlIENhbGxiYWNrID1cbiAgLyoqXG4gICAqIEEgZnVuY3Rpb24gd2hpY2ggd2lsbCBiZSBjYWxsZWQgYWZ0ZXIgdGhlIFtbQnVsa0xvYWRdXSBmaW5pc2hlcyBleGVjdXRpbmcuXG4gICAqXG4gICAqIEBwYXJhbSByb3dDb3VudCB0aGUgbnVtYmVyIG9mIHJvd3MgaW5zZXJ0ZWRcbiAgICovXG4gIChlcnI6IEVycm9yIHwgdW5kZWZpbmVkIHwgbnVsbCwgcm93Q291bnQ/OiBudW1iZXIpID0+IHZvaWQ7XG5cbmludGVyZmFjZSBDb2x1bW4gZXh0ZW5kcyBQYXJhbWV0ZXIge1xuICBvYmpOYW1lOiBzdHJpbmc7XG4gIGNvbGxhdGlvbjogQ29sbGF0aW9uIHwgdW5kZWZpbmVkO1xufVxuXG5pbnRlcmZhY2UgQ29sdW1uT3B0aW9ucyB7XG4gIG91dHB1dD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEZvciBWYXJDaGFyLCBOVmFyQ2hhciwgVmFyQmluYXJ5LiBVc2UgbGVuZ3RoIGFzIGBJbmZpbml0eWAgZm9yIFZhckNoYXIobWF4KSwgTlZhckNoYXIobWF4KSBhbmQgVmFyQmluYXJ5KG1heCkuXG4gICAqL1xuICBsZW5ndGg/OiBudW1iZXI7XG5cbiAgLyoqXG4gICAqIEZvciBOdW1lcmljLCBEZWNpbWFsLlxuICAgKi9cbiAgcHJlY2lzaW9uPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBGb3IgTnVtZXJpYywgRGVjaW1hbCwgVGltZSwgRGF0ZVRpbWUyLCBEYXRlVGltZU9mZnNldC5cbiAgICovXG4gIHNjYWxlPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBJZiB0aGUgbmFtZSBvZiB0aGUgY29sdW1uIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBmb3VuZCBvbiBgcm93T2JqYCBhcmd1bWVudHMgcGFzc2VkIHRvIFtbYWRkUm93XV0sIHRoZW4geW91IGNhbiB1c2UgdGhpcyBvcHRpb24gdG8gc3BlY2lmeSB0aGUgcHJvcGVydHkgbmFtZS5cbiAgICovXG4gIG9iak5hbWU/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIHRoZSBjb2x1bW4gYWNjZXB0cyBOVUxMIHZhbHVlcy5cbiAgICovXG4gIG51bGxhYmxlPzogYm9vbGVhbjtcbn1cblxuY29uc3Qgcm93VG9rZW5CdWZmZXIgPSBCdWZmZXIuZnJvbShbIFRPS0VOX1RZUEUuUk9XIF0pO1xuY29uc3QgdGV4dFBvaW50ZXJBbmRUaW1lc3RhbXBCdWZmZXIgPSBCdWZmZXIuZnJvbShbXG4gIC8vIFRleHRQb2ludGVyIGxlbmd0aFxuICAweDEwLFxuXG4gIC8vIFRleHRQb2ludGVyXG4gIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsXG5cbiAgLy8gVGltZXN0YW1wXG4gIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDAsIDB4MDBcbl0pO1xuY29uc3QgdGV4dFBvaW50ZXJOdWxsQnVmZmVyID0gQnVmZmVyLmZyb20oWzB4MDBdKTtcblxuLy8gQSB0cmFuc2Zvcm0gdGhhdCBjb252ZXJ0cyByb3dzIHRvIHBhY2tldHMuXG5jbGFzcyBSb3dUcmFuc2Zvcm0gZXh0ZW5kcyBUcmFuc2Zvcm0ge1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgY29sdW1uTWV0YWRhdGFXcml0dGVuOiBib29sZWFuO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgYnVsa0xvYWQ6IEJ1bGtMb2FkO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgbWFpbk9wdGlvbnM6IEJ1bGtMb2FkWydvcHRpb25zJ107XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBjb2x1bW5zOiBCdWxrTG9hZFsnY29sdW1ucyddO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY29uc3RydWN0b3IoYnVsa0xvYWQ6IEJ1bGtMb2FkKSB7XG4gICAgc3VwZXIoeyB3cml0YWJsZU9iamVjdE1vZGU6IHRydWUgfSk7XG5cbiAgICB0aGlzLmJ1bGtMb2FkID0gYnVsa0xvYWQ7XG4gICAgdGhpcy5tYWluT3B0aW9ucyA9IGJ1bGtMb2FkLm9wdGlvbnM7XG4gICAgdGhpcy5jb2x1bW5zID0gYnVsa0xvYWQuY29sdW1ucztcblxuICAgIHRoaXMuY29sdW1uTWV0YWRhdGFXcml0dGVuID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF90cmFuc2Zvcm0ocm93OiBBcnJheTx1bmtub3duPiB8IHsgW2NvbE5hbWU6IHN0cmluZ106IHVua25vd24gfSwgX2VuY29kaW5nOiBzdHJpbmcsIGNhbGxiYWNrOiAoZXJyb3I/OiBFcnJvcikgPT4gdm9pZCkge1xuICAgIGlmICghdGhpcy5jb2x1bW5NZXRhZGF0YVdyaXR0ZW4pIHtcbiAgICAgIHRoaXMucHVzaCh0aGlzLmJ1bGtMb2FkLmdldENvbE1ldGFEYXRhKCkpO1xuICAgICAgdGhpcy5jb2x1bW5NZXRhZGF0YVdyaXR0ZW4gPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMucHVzaChyb3dUb2tlbkJ1ZmZlcik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY29sdW1ucy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgYyA9IHRoaXMuY29sdW1uc1tpXTtcbiAgICAgIGxldCB2YWx1ZSA9IEFycmF5LmlzQXJyYXkocm93KSA/IHJvd1tpXSA6IHJvd1tjLm9iak5hbWVdO1xuXG4gICAgICBpZiAoIXRoaXMuYnVsa0xvYWQuZmlyc3RSb3dXcml0dGVuKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFsdWUgPSBjLnR5cGUudmFsaWRhdGUodmFsdWUsIGMuY29sbGF0aW9uKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgY29uc3QgcGFyYW1ldGVyID0ge1xuICAgICAgICBsZW5ndGg6IGMubGVuZ3RoLFxuICAgICAgICBzY2FsZTogYy5zY2FsZSxcbiAgICAgICAgcHJlY2lzaW9uOiBjLnByZWNpc2lvbixcbiAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICB9O1xuXG4gICAgICBpZiAoYy50eXBlLm5hbWUgPT09ICdUZXh0JyB8fCBjLnR5cGUubmFtZSA9PT0gJ0ltYWdlJyB8fCBjLnR5cGUubmFtZSA9PT0gJ05UZXh0Jykge1xuICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgICAgICAgIHRoaXMucHVzaCh0ZXh0UG9pbnRlck51bGxCdWZmZXIpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wdXNoKHRleHRQb2ludGVyQW5kVGltZXN0YW1wQnVmZmVyKTtcbiAgICAgIH1cblxuICAgICAgdHJ5IHtcbiAgICAgICAgdGhpcy5wdXNoKGMudHlwZS5nZW5lcmF0ZVBhcmFtZXRlckxlbmd0aChwYXJhbWV0ZXIsIHRoaXMubWFpbk9wdGlvbnMpKTtcbiAgICAgICAgZm9yIChjb25zdCBjaHVuayBvZiBjLnR5cGUuZ2VuZXJhdGVQYXJhbWV0ZXJEYXRhKHBhcmFtZXRlciwgdGhpcy5tYWluT3B0aW9ucykpIHtcbiAgICAgICAgICB0aGlzLnB1c2goY2h1bmspO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnJvcjogYW55KSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnJvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcHJvY2Vzcy5uZXh0VGljayhjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIF9mbHVzaChjYWxsYmFjazogKCkgPT4gdm9pZCkge1xuICAgIHRoaXMucHVzaCh0aGlzLmJ1bGtMb2FkLmNyZWF0ZURvbmVUb2tlbigpKTtcblxuICAgIHByb2Nlc3MubmV4dFRpY2soY2FsbGJhY2spO1xuICB9XG59XG5cbi8qKlxuICogQSBCdWxrTG9hZCBpbnN0YW5jZSBpcyB1c2VkIHRvIHBlcmZvcm0gYSBidWxrIGluc2VydC5cbiAqXG4gKiBVc2UgW1tDb25uZWN0aW9uLm5ld0J1bGtMb2FkXV0gdG8gY3JlYXRlIGEgbmV3IGluc3RhbmNlLCBhbmQgW1tDb25uZWN0aW9uLmV4ZWNCdWxrTG9hZF1dIHRvIGV4ZWN1dGUgaXQuXG4gKlxuICogRXhhbXBsZSBvZiBCdWxrTG9hZCBVc2FnZXM6XG4gKlxuICogYGBganNcbiAqIC8vIG9wdGlvbmFsIEJ1bGtMb2FkIG9wdGlvbnNcbiAqIGNvbnN0IG9wdGlvbnMgPSB7IGtlZXBOdWxsczogdHJ1ZSB9O1xuICpcbiAqIC8vIGluc3RhbnRpYXRlIC0gcHJvdmlkZSB0aGUgdGFibGUgd2hlcmUgeW91J2xsIGJlIGluc2VydGluZyB0bywgb3B0aW9ucyBhbmQgYSBjYWxsYmFja1xuICogY29uc3QgYnVsa0xvYWQgPSBjb25uZWN0aW9uLm5ld0J1bGtMb2FkKCdNeVRhYmxlJywgb3B0aW9ucywgKGVycm9yLCByb3dDb3VudCkgPT4ge1xuICogICBjb25zb2xlLmxvZygnaW5zZXJ0ZWQgJWQgcm93cycsIHJvd0NvdW50KTtcbiAqIH0pO1xuICpcbiAqIC8vIHNldHVwIHlvdXIgY29sdW1ucyAtIGFsd2F5cyBpbmRpY2F0ZSB3aGV0aGVyIHRoZSBjb2x1bW4gaXMgbnVsbGFibGVcbiAqIGJ1bGtMb2FkLmFkZENvbHVtbignbXlJbnQnLCBUWVBFUy5JbnQsIHsgbnVsbGFibGU6IGZhbHNlIH0pO1xuICogYnVsa0xvYWQuYWRkQ29sdW1uKCdteVN0cmluZycsIFRZUEVTLk5WYXJDaGFyLCB7IGxlbmd0aDogNTAsIG51bGxhYmxlOiB0cnVlIH0pO1xuICpcbiAqIC8vIGV4ZWN1dGVcbiAqIGNvbm5lY3Rpb24uZXhlY0J1bGtMb2FkKGJ1bGtMb2FkLCBbXG4gKiAgIHsgbXlJbnQ6IDcsIG15U3RyaW5nOiAnaGVsbG8nIH0sXG4gKiAgIHsgbXlJbnQ6IDIzLCBteVN0cmluZzogJ3dvcmxkJyB9XG4gKiBdKTtcbiAqIGBgYFxuICovXG5jbGFzcyBCdWxrTG9hZCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBlcnJvcjogRXJyb3IgfCB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBjYW5jZWxlZDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGV4ZWN1dGlvblN0YXJ0ZWQ6IGJvb2xlYW47XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBzdHJlYW1pbmdNb2RlOiBib29sZWFuO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgdGFibGU6IHN0cmluZztcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHRpbWVvdXQ6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgb3B0aW9uczogSW50ZXJuYWxDb25uZWN0aW9uT3B0aW9ucztcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGNhbGxiYWNrOiBDYWxsYmFjaztcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgY29sdW1uczogQXJyYXk8Q29sdW1uPjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGNvbHVtbnNCeU5hbWU6IHsgW25hbWU6IHN0cmluZ106IENvbHVtbiB9O1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBmaXJzdFJvd1dyaXR0ZW46IGJvb2xlYW47XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSByb3dUb1BhY2tldFRyYW5zZm9ybTogUm93VHJhbnNmb3JtO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBidWxrT3B0aW9uczogSW50ZXJuYWxPcHRpb25zO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBjb25uZWN0aW9uOiBDb25uZWN0aW9uIHwgdW5kZWZpbmVkO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgcm93czogQXJyYXk8YW55PiB8IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHJzdDogQXJyYXk8YW55PiB8IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHJvd0NvdW50OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgZGVjbGFyZSBjb2xsYXRpb246IENvbGxhdGlvbiB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNvbnN0cnVjdG9yKHRhYmxlOiBzdHJpbmcsIGNvbGxhdGlvbjogQ29sbGF0aW9uIHwgdW5kZWZpbmVkLCBjb25uZWN0aW9uT3B0aW9uczogSW50ZXJuYWxDb25uZWN0aW9uT3B0aW9ucywge1xuICAgIGNoZWNrQ29uc3RyYWludHMgPSBmYWxzZSxcbiAgICBmaXJlVHJpZ2dlcnMgPSBmYWxzZSxcbiAgICBrZWVwTnVsbHMgPSBmYWxzZSxcbiAgICBsb2NrVGFibGUgPSBmYWxzZSxcbiAgICBvcmRlciA9IHt9LFxuICB9OiBPcHRpb25zLCBjYWxsYmFjazogQ2FsbGJhY2spIHtcbiAgICBpZiAodHlwZW9mIGNoZWNrQ29uc3RyYWludHMgIT09ICdib29sZWFuJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwib3B0aW9ucy5jaGVja0NvbnN0cmFpbnRzXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBmaXJlVHJpZ2dlcnMgIT09ICdib29sZWFuJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwib3B0aW9ucy5maXJlVHJpZ2dlcnNcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgYm9vbGVhbi4nKTtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIGtlZXBOdWxscyAhPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJvcHRpb25zLmtlZXBOdWxsc1wiIHByb3BlcnR5IG11c3QgYmUgb2YgdHlwZSBib29sZWFuLicpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbG9ja1RhYmxlICE9PSAnYm9vbGVhbicpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcIm9wdGlvbnMubG9ja1RhYmxlXCIgcHJvcGVydHkgbXVzdCBiZSBvZiB0eXBlIGJvb2xlYW4uJyk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBvcmRlciAhPT0gJ29iamVjdCcgfHwgb3JkZXIgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcIm9wdGlvbnMub3JkZXJcIiBwcm9wZXJ0eSBtdXN0IGJlIG9mIHR5cGUgb2JqZWN0LicpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgW2NvbHVtbiwgZGlyZWN0aW9uXSBvZiBPYmplY3QuZW50cmllcyhvcmRlcikpIHtcbiAgICAgIGlmIChkaXJlY3Rpb24gIT09ICdBU0MnICYmIGRpcmVjdGlvbiAhPT0gJ0RFU0MnKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2YWx1ZSBvZiB0aGUgXCInICsgY29sdW1uICsgJ1wiIGtleSBpbiB0aGUgXCJvcHRpb25zLm9yZGVyXCIgb2JqZWN0IG11c3QgYmUgZWl0aGVyIFwiQVNDXCIgb3IgXCJERVNDXCIuJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuZXJyb3IgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5jYW5jZWxlZCA9IGZhbHNlO1xuICAgIHRoaXMuZXhlY3V0aW9uU3RhcnRlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5jb2xsYXRpb24gPSBjb2xsYXRpb247XG5cbiAgICB0aGlzLnRhYmxlID0gdGFibGU7XG4gICAgdGhpcy5vcHRpb25zID0gY29ubmVjdGlvbk9wdGlvbnM7XG4gICAgdGhpcy5jYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIHRoaXMuY29sdW1ucyA9IFtdO1xuICAgIHRoaXMuY29sdW1uc0J5TmFtZSA9IHt9O1xuICAgIHRoaXMuZmlyc3RSb3dXcml0dGVuID0gZmFsc2U7XG4gICAgdGhpcy5zdHJlYW1pbmdNb2RlID0gZmFsc2U7XG5cbiAgICB0aGlzLnJvd1RvUGFja2V0VHJhbnNmb3JtID0gbmV3IFJvd1RyYW5zZm9ybSh0aGlzKTtcblxuICAgIHRoaXMuYnVsa09wdGlvbnMgPSB7IGNoZWNrQ29uc3RyYWludHMsIGZpcmVUcmlnZ2Vycywga2VlcE51bGxzLCBsb2NrVGFibGUsIG9yZGVyIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkcyBhIGNvbHVtbiB0byB0aGUgYnVsayBsb2FkLlxuICAgKlxuICAgKiBUaGUgY29sdW1uIGRlZmluaXRpb25zIHNob3VsZCBtYXRjaCB0aGUgdGFibGUgeW91IGFyZSB0cnlpbmcgdG8gaW5zZXJ0IGludG8uXG4gICAqIEF0dGVtcHRpbmcgdG8gY2FsbCBhZGRDb2x1bW4gYWZ0ZXIgdGhlIGZpcnN0IHJvdyBoYXMgYmVlbiBhZGRlZCB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbi5cbiAgICpcbiAgICogYGBganNcbiAgICogYnVsa0xvYWQuYWRkQ29sdW1uKCdNeUludENvbHVtbicsIFRZUEVTLkludCwgeyBudWxsYWJsZTogZmFsc2UgfSk7XG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSBvZiB0aGUgY29sdW1uLlxuICAgKiBAcGFyYW0gdHlwZSBPbmUgb2YgdGhlIHN1cHBvcnRlZCBgZGF0YSB0eXBlc2AuXG4gICAqIEBwYXJhbSBfX25hbWVkUGFyYW1ldGVycyBBZGRpdGlvbmFsIGNvbHVtbiB0eXBlIGluZm9ybWF0aW9uLiBBdCBhIG1pbmltdW0sIGBudWxsYWJsZWAgbXVzdCBiZSBzZXQgdG8gdHJ1ZSBvciBmYWxzZS5cbiAgICogQHBhcmFtIGxlbmd0aCBGb3IgVmFyQ2hhciwgTlZhckNoYXIsIFZhckJpbmFyeS4gVXNlIGxlbmd0aCBhcyBgSW5maW5pdHlgIGZvciBWYXJDaGFyKG1heCksIE5WYXJDaGFyKG1heCkgYW5kIFZhckJpbmFyeShtYXgpLlxuICAgKiBAcGFyYW0gbnVsbGFibGUgSW5kaWNhdGVzIHdoZXRoZXIgdGhlIGNvbHVtbiBhY2NlcHRzIE5VTEwgdmFsdWVzLlxuICAgKiBAcGFyYW0gb2JqTmFtZSBJZiB0aGUgbmFtZSBvZiB0aGUgY29sdW1uIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBuYW1lIG9mIHRoZSBwcm9wZXJ0eSBmb3VuZCBvbiBgcm93T2JqYCBhcmd1bWVudHMgcGFzc2VkIHRvIFtbYWRkUm93XV0gb3IgW1tDb25uZWN0aW9uLmV4ZWNCdWxrTG9hZF1dLCB0aGVuIHlvdSBjYW4gdXNlIHRoaXMgb3B0aW9uIHRvIHNwZWNpZnkgdGhlIHByb3BlcnR5IG5hbWUuXG4gICAqIEBwYXJhbSBwcmVjaXNpb24gRm9yIE51bWVyaWMsIERlY2ltYWwuXG4gICAqIEBwYXJhbSBzY2FsZSBGb3IgTnVtZXJpYywgRGVjaW1hbCwgVGltZSwgRGF0ZVRpbWUyLCBEYXRlVGltZU9mZnNldC5cbiAgKi9cbiAgYWRkQ29sdW1uKG5hbWU6IHN0cmluZywgdHlwZTogRGF0YVR5cGUsIHsgb3V0cHV0ID0gZmFsc2UsIGxlbmd0aCwgcHJlY2lzaW9uLCBzY2FsZSwgb2JqTmFtZSA9IG5hbWUsIG51bGxhYmxlID0gdHJ1ZSB9OiBDb2x1bW5PcHRpb25zKSB7XG4gICAgaWYgKHRoaXMuZmlyc3RSb3dXcml0dGVuKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbHVtbnMgY2Fubm90IGJlIGFkZGVkIHRvIGJ1bGsgaW5zZXJ0IGFmdGVyIHRoZSBmaXJzdCByb3cgaGFzIGJlZW4gd3JpdHRlbi4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZXhlY3V0aW9uU3RhcnRlZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdDb2x1bW5zIGNhbm5vdCBiZSBhZGRlZCB0byBidWxrIGluc2VydCBhZnRlciBleGVjdXRpb24gaGFzIHN0YXJ0ZWQuJyk7XG4gICAgfVxuXG4gICAgY29uc3QgY29sdW1uOiBDb2x1bW4gPSB7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgbmFtZTogbmFtZSxcbiAgICAgIHZhbHVlOiBudWxsLFxuICAgICAgb3V0cHV0OiBvdXRwdXQsXG4gICAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICAgIHByZWNpc2lvbjogcHJlY2lzaW9uLFxuICAgICAgc2NhbGU6IHNjYWxlLFxuICAgICAgb2JqTmFtZTogb2JqTmFtZSxcbiAgICAgIG51bGxhYmxlOiBudWxsYWJsZSxcbiAgICAgIGNvbGxhdGlvbjogdGhpcy5jb2xsYXRpb25cbiAgICB9O1xuXG4gICAgaWYgKCh0eXBlLmlkICYgMHgzMCkgPT09IDB4MjApIHtcbiAgICAgIGlmIChjb2x1bW4ubGVuZ3RoID09IG51bGwgJiYgdHlwZS5yZXNvbHZlTGVuZ3RoKSB7XG4gICAgICAgIGNvbHVtbi5sZW5ndGggPSB0eXBlLnJlc29sdmVMZW5ndGgoY29sdW1uKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZS5yZXNvbHZlUHJlY2lzaW9uICYmIGNvbHVtbi5wcmVjaXNpb24gPT0gbnVsbCkge1xuICAgICAgY29sdW1uLnByZWNpc2lvbiA9IHR5cGUucmVzb2x2ZVByZWNpc2lvbihjb2x1bW4pO1xuICAgIH1cblxuICAgIGlmICh0eXBlLnJlc29sdmVTY2FsZSAmJiBjb2x1bW4uc2NhbGUgPT0gbnVsbCkge1xuICAgICAgY29sdW1uLnNjYWxlID0gdHlwZS5yZXNvbHZlU2NhbGUoY29sdW1uKTtcbiAgICB9XG5cbiAgICB0aGlzLmNvbHVtbnMucHVzaChjb2x1bW4pO1xuXG4gICAgdGhpcy5jb2x1bW5zQnlOYW1lW25hbWVdID0gY29sdW1uO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRPcHRpb25zU3FsKCkge1xuICAgIGNvbnN0IGFkZE9wdGlvbnMgPSBbXTtcblxuICAgIGlmICh0aGlzLmJ1bGtPcHRpb25zLmNoZWNrQ29uc3RyYWludHMpIHtcbiAgICAgIGFkZE9wdGlvbnMucHVzaCgnQ0hFQ0tfQ09OU1RSQUlOVFMnKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5idWxrT3B0aW9ucy5maXJlVHJpZ2dlcnMpIHtcbiAgICAgIGFkZE9wdGlvbnMucHVzaCgnRklSRV9UUklHR0VSUycpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmJ1bGtPcHRpb25zLmtlZXBOdWxscykge1xuICAgICAgYWRkT3B0aW9ucy5wdXNoKCdLRUVQX05VTExTJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuYnVsa09wdGlvbnMubG9ja1RhYmxlKSB7XG4gICAgICBhZGRPcHRpb25zLnB1c2goJ1RBQkxPQ0snKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5idWxrT3B0aW9ucy5vcmRlcikge1xuICAgICAgY29uc3Qgb3JkZXJDb2x1bW5zID0gW107XG5cbiAgICAgIGZvciAoY29uc3QgW2NvbHVtbiwgZGlyZWN0aW9uXSBvZiBPYmplY3QuZW50cmllcyh0aGlzLmJ1bGtPcHRpb25zLm9yZGVyKSkge1xuICAgICAgICBvcmRlckNvbHVtbnMucHVzaChgJHtjb2x1bW59ICR7ZGlyZWN0aW9ufWApO1xuICAgICAgfVxuXG4gICAgICBpZiAob3JkZXJDb2x1bW5zLmxlbmd0aCkge1xuICAgICAgICBhZGRPcHRpb25zLnB1c2goYE9SREVSICgke29yZGVyQ29sdW1ucy5qb2luKCcsICcpfSlgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoYWRkT3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gYCBXSVRIICgke2FkZE9wdGlvbnMuam9pbignLCcpfSlgO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRCdWxrSW5zZXJ0U3FsKCkge1xuICAgIGxldCBzcWwgPSAnaW5zZXJ0IGJ1bGsgJyArIHRoaXMudGFibGUgKyAnKCc7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMuY29sdW1ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgYyA9IHRoaXMuY29sdW1uc1tpXTtcbiAgICAgIGlmIChpICE9PSAwKSB7XG4gICAgICAgIHNxbCArPSAnLCAnO1xuICAgICAgfVxuICAgICAgc3FsICs9ICdbJyArIGMubmFtZSArICddICcgKyAoYy50eXBlLmRlY2xhcmF0aW9uKGMpKTtcbiAgICB9XG4gICAgc3FsICs9ICcpJztcblxuICAgIHNxbCArPSB0aGlzLmdldE9wdGlvbnNTcWwoKTtcbiAgICByZXR1cm4gc3FsO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgaXMgc2ltcGx5IGEgaGVscGVyIHV0aWxpdHkgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIGBDUkVBVEUgVEFCTEUgU1FMYCBzdGF0ZW1lbnQgYmFzZWQgb24gdGhlIGNvbHVtbnMgYWRkZWQgdG8gdGhlIGJ1bGtMb2FkIG9iamVjdC5cbiAgICogVGhpcyBtYXkgYmUgcGFydGljdWxhcmx5IGhhbmR5IHdoZW4geW91IHdhbnQgdG8gaW5zZXJ0IGludG8gYSB0ZW1wb3JhcnkgdGFibGUgKGEgdGFibGUgd2hpY2ggc3RhcnRzIHdpdGggYCNgKS5cbiAgICpcbiAgICogYGBganNcbiAgICogdmFyIHNxbCA9IGJ1bGtMb2FkLmdldFRhYmxlQ3JlYXRpb25TcWwoKTtcbiAgICogYGBgXG4gICAqXG4gICAqIEEgc2lkZSBub3RlIG9uIGJ1bGsgaW5zZXJ0aW5nIGludG8gdGVtcG9yYXJ5IHRhYmxlczogaWYgeW91IHdhbnQgdG8gYWNjZXNzIGEgbG9jYWwgdGVtcG9yYXJ5IHRhYmxlIGFmdGVyIGV4ZWN1dGluZyB0aGUgYnVsayBsb2FkLFxuICAgKiB5b3UnbGwgbmVlZCB0byB1c2UgdGhlIHNhbWUgY29ubmVjdGlvbiBhbmQgZXhlY3V0ZSB5b3VyIHJlcXVlc3RzIHVzaW5nIFtbQ29ubmVjdGlvbi5leGVjU3FsQmF0Y2hdXSBpbnN0ZWFkIG9mIFtbQ29ubmVjdGlvbi5leGVjU3FsXV1cbiAgICovXG4gIGdldFRhYmxlQ3JlYXRpb25TcWwoKSB7XG4gICAgbGV0IHNxbCA9ICdDUkVBVEUgVEFCTEUgJyArIHRoaXMudGFibGUgKyAnKFxcbic7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHRoaXMuY29sdW1ucy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3QgYyA9IHRoaXMuY29sdW1uc1tpXTtcbiAgICAgIGlmIChpICE9PSAwKSB7XG4gICAgICAgIHNxbCArPSAnLFxcbic7XG4gICAgICB9XG4gICAgICBzcWwgKz0gJ1snICsgYy5uYW1lICsgJ10gJyArIChjLnR5cGUuZGVjbGFyYXRpb24oYykpO1xuICAgICAgaWYgKGMubnVsbGFibGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzcWwgKz0gJyAnICsgKGMubnVsbGFibGUgPyAnTlVMTCcgOiAnTk9UIE5VTEwnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3FsICs9ICdcXG4pJztcbiAgICByZXR1cm4gc3FsO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBnZXRDb2xNZXRhRGF0YSgpIHtcbiAgICBjb25zdCB0QnVmID0gbmV3IFdyaXRhYmxlVHJhY2tpbmdCdWZmZXIoMTAwLCBudWxsLCB0cnVlKTtcbiAgICAvLyBUb2tlblR5cGVcbiAgICB0QnVmLndyaXRlVUludDgoVE9LRU5fVFlQRS5DT0xNRVRBREFUQSk7XG4gICAgLy8gQ291bnRcbiAgICB0QnVmLndyaXRlVUludDE2TEUodGhpcy5jb2x1bW5zLmxlbmd0aCk7XG5cbiAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gdGhpcy5jb2x1bW5zLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBjb25zdCBjID0gdGhpcy5jb2x1bW5zW2pdO1xuICAgICAgLy8gVXNlclR5cGVcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMudGRzVmVyc2lvbiA8ICc3XzInKSB7XG4gICAgICAgIHRCdWYud3JpdGVVSW50MTZMRSgwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRCdWYud3JpdGVVSW50MzJMRSgwKTtcbiAgICAgIH1cblxuICAgICAgLy8gRmxhZ3NcbiAgICAgIGxldCBmbGFncyA9IEZMQUdTLnVwZGF0ZWFibGVSZWFkV3JpdGU7XG4gICAgICBpZiAoYy5udWxsYWJsZSkge1xuICAgICAgICBmbGFncyB8PSBGTEFHUy5udWxsYWJsZTtcbiAgICAgIH0gZWxzZSBpZiAoYy5udWxsYWJsZSA9PT0gdW5kZWZpbmVkICYmIHRoaXMub3B0aW9ucy50ZHNWZXJzaW9uID49ICc3XzInKSB7XG4gICAgICAgIGZsYWdzIHw9IEZMQUdTLm51bGxhYmxlVW5rbm93bjtcbiAgICAgIH1cbiAgICAgIHRCdWYud3JpdGVVSW50MTZMRShmbGFncyk7XG5cbiAgICAgIC8vIFRZUEVfSU5GT1xuICAgICAgdEJ1Zi53cml0ZUJ1ZmZlcihjLnR5cGUuZ2VuZXJhdGVUeXBlSW5mbyhjLCB0aGlzLm9wdGlvbnMpKTtcblxuICAgICAgLy8gVGFibGVOYW1lXG4gICAgICBpZiAoYy50eXBlLmhhc1RhYmxlTmFtZSkge1xuICAgICAgICB0QnVmLndyaXRlVXNWYXJjaGFyKHRoaXMudGFibGUsICd1Y3MyJyk7XG4gICAgICB9XG5cbiAgICAgIC8vIENvbE5hbWVcbiAgICAgIHRCdWYud3JpdGVCVmFyY2hhcihjLm5hbWUsICd1Y3MyJyk7XG4gICAgfVxuICAgIHJldHVybiB0QnVmLmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIHRpbWVvdXQgZm9yIHRoaXMgYnVsayBsb2FkLlxuICAgKlxuICAgKiBgYGBqc1xuICAgKiBidWxrTG9hZC5zZXRUaW1lb3V0KHRpbWVvdXQpO1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHRpbWVvdXQgVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmVmb3JlIHRoZSBidWxrIGxvYWQgaXMgY29uc2lkZXJlZCBmYWlsZWQsIG9yIDAgZm9yIG5vIHRpbWVvdXQuXG4gICAqICAgV2hlbiBubyB0aW1lb3V0IGlzIHNldCBmb3IgdGhlIGJ1bGsgbG9hZCwgdGhlIFtbQ29ubmVjdGlvbk9wdGlvbnMucmVxdWVzdFRpbWVvdXRdXSBvZiB0aGUgQ29ubmVjdGlvbiBpcyB1c2VkLlxuICAgKi9cbiAgc2V0VGltZW91dCh0aW1lb3V0PzogbnVtYmVyKSB7XG4gICAgdGhpcy50aW1lb3V0ID0gdGltZW91dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY3JlYXRlRG9uZVRva2VuKCkge1xuICAgIC8vIEl0IG1pZ2h0IGJlIG5pY2UgdG8gbWFrZSBEb25lVG9rZW4gYSBjbGFzcyBpZiBhbnl0aGluZyBuZWVkcyB0byBjcmVhdGUgdGhlbSwgYnV0IGZvciBub3csIGp1c3QgZG8gaXQgaGVyZVxuICAgIGNvbnN0IHRCdWYgPSBuZXcgV3JpdGFibGVUcmFja2luZ0J1ZmZlcih0aGlzLm9wdGlvbnMudGRzVmVyc2lvbiA8ICc3XzInID8gOSA6IDEzKTtcbiAgICB0QnVmLndyaXRlVUludDgoVE9LRU5fVFlQRS5ET05FKTtcbiAgICBjb25zdCBzdGF0dXMgPSBET05FX1NUQVRVUy5GSU5BTDtcbiAgICB0QnVmLndyaXRlVUludDE2TEUoc3RhdHVzKTtcbiAgICB0QnVmLndyaXRlVUludDE2TEUoMCk7IC8vIEN1ckNtZCAoVERTIGlnbm9yZXMgdGhpcylcbiAgICB0QnVmLndyaXRlVUludDMyTEUoMCk7IC8vIHJvdyBjb3VudCAtIGRvZXNuJ3QgcmVhbGx5IG1hdHRlclxuICAgIGlmICh0aGlzLm9wdGlvbnMudGRzVmVyc2lvbiA+PSAnN18yJykge1xuICAgICAgdEJ1Zi53cml0ZVVJbnQzMkxFKDApOyAvLyByb3cgY291bnQgaXMgNjQgYml0cyBpbiA+PSBURFMgNy4yXG4gICAgfVxuICAgIHJldHVybiB0QnVmLmRhdGE7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhbmNlbCgpIHtcbiAgICBpZiAodGhpcy5jYW5jZWxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY2FuY2VsZWQgPSB0cnVlO1xuICAgIHRoaXMuZW1pdCgnY2FuY2VsJyk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQnVsa0xvYWQ7XG5tb2R1bGUuZXhwb3J0cyA9IEJ1bGtMb2FkO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxPQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyx1QkFBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FBR0EsSUFBQUcsT0FBQSxHQUFBSCxPQUFBO0FBQ0EsSUFBQUksTUFBQSxHQUFBSixPQUFBO0FBQW1ELFNBQUFFLHVCQUFBRyxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBS25EO0FBQ0E7QUFDQTtBQUNBLE1BQU1HLEtBQUssR0FBRztFQUNaQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUM7RUFDaEJDLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQztFQUNmQyxtQkFBbUIsRUFBRSxDQUFDLElBQUksQ0FBQztFQUMzQkMsaUJBQWlCLEVBQUUsQ0FBQyxJQUFJLENBQUM7RUFDekJDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQztFQUNoQkMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDO0VBQUU7RUFDbEJDLGVBQWUsRUFBRSxDQUFDLElBQUksQ0FBQztFQUFFO0VBQ3pCQyxlQUFlLEVBQUUsQ0FBQyxJQUFJLEVBQUU7RUFBRTtFQUMxQkMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFO0VBQUU7RUFDakJDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRTtFQUFFO0VBQ2RDLGVBQWUsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQzNCLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsTUFBTUMsV0FBVyxHQUFHO0VBQ2xCQyxLQUFLLEVBQUUsSUFBSTtFQUNYQyxJQUFJLEVBQUUsR0FB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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/debug.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _events = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
var util = _interopRequireWildcard(__turbopack_context__.r("[externals]/util [external] (util, cjs)"));
function _interopRequireWildcard(e, t) {
    if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap();
    return (_interopRequireWildcard = function(e, t) {
        if (!t && e && e.__esModule) return e;
        var o, i, f = {
            __proto__: null,
            default: e
        };
        if (null === e || "object" != typeof e && "function" != typeof e) return f;
        if (o = t ? n : r) {
            if (o.has(e)) return o.get(e);
            o.set(e, f);
        }
        for(const t in e)"default" !== t && ({}).hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);
        return f;
    })(e, t);
}
class Debug extends _events.EventEmitter {
    /*
    @options    Which debug details should be sent.
                data    - dump of packet data
                payload - details of decoded payload
  */ constructor({ data = false, payload = false, packet = false, token = false } = {}){
        super();
        this.options = {
            data,
            payload,
            packet,
            token
        };
        this.indent = '  ';
    }
    packet(direction, packet) {
        if (this.haveListeners() && this.options.packet) {
            this.log('');
            this.log(direction);
            this.log(packet.headerToString(this.indent));
        }
    }
    data(packet) {
        if (this.haveListeners() && this.options.data) {
            this.log(packet.dataToString(this.indent));
        }
    }
    payload(generatePayloadText) {
        if (this.haveListeners() && this.options.payload) {
            this.log(generatePayloadText());
        }
    }
    token(token) {
        if (this.haveListeners() && this.options.token) {
            this.log(util.inspect(token, {
                showHidden: false,
                depth: 5,
                colors: true
            }));
        }
    }
    haveListeners() {
        return this.listeners('debug').length > 0;
    }
    log(text) {
        this.emit('debug', text);
    }
}
var _default = exports.default = Debug;
module.exports = Debug; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRzIiwicmVxdWlyZSIsInV0aWwiLCJfaW50ZXJvcFJlcXVpcmVXaWxkY2FyZCIsImUiLCJ0IiwiV2Vha01hcCIsInIiLCJuIiwiX19lc01vZHVsZSIsIm8iLCJpIiwiZiIsIl9fcHJvdG9fXyIsImRlZmF1bHQiLCJoYXMiLCJnZXQiLCJzZXQiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIkRlYnVnIiwiRXZlbnRFbWl0dGVyIiwiY29uc3RydWN0b3IiLCJkYXRhIiwicGF5bG9hZCIsInBhY2tldCIsInRva2VuIiwib3B0aW9ucyIsImluZGVudCIsImRpcmVjdGlvbiIsImhhdmVMaXN0ZW5lcnMiLCJsb2ciLCJoZWFkZXJUb1N0cmluZyIsImRhdGFUb1N0cmluZyIsImdlbmVyYXRlUGF5bG9hZFRleHQiLCJpbnNwZWN0Iiwic2hvd0hpZGRlbiIsImRlcHRoIiwiY29sb3JzIiwibGlzdGVuZXJzIiwibGVuZ3RoIiwidGV4dCIsImVtaXQiLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiXSwic291cmNlcyI6WyIuLi9zcmMvZGVidWcudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAndXRpbCc7XG5pbXBvcnQgeyBQYWNrZXQgfSBmcm9tICcuL3BhY2tldCc7XG5pbXBvcnQgdHlwZSB7IFRva2VuIH0gZnJvbSAnLi90b2tlbi90b2tlbic7XG5cbmNsYXNzIERlYnVnIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgZGVjbGFyZSBvcHRpb25zOiB7XG4gICAgZGF0YTogYm9vbGVhbjtcbiAgICBwYXlsb2FkOiBib29sZWFuO1xuICAgIHBhY2tldDogYm9vbGVhbjtcbiAgICB0b2tlbjogYm9vbGVhbjtcbiAgfTtcblxuICBkZWNsYXJlIGluZGVudDogc3RyaW5nO1xuXG4gIC8qXG4gICAgQG9wdGlvbnMgICAgV2hpY2ggZGVidWcgZGV0YWlscyBzaG91bGQgYmUgc2VudC5cbiAgICAgICAgICAgICAgICBkYXRhICAgIC0gZHVtcCBvZiBwYWNrZXQgZGF0YVxuICAgICAgICAgICAgICAgIHBheWxvYWQgLSBkZXRhaWxzIG9mIGRlY29kZWQgcGF5bG9hZFxuICAqL1xuICBjb25zdHJ1Y3Rvcih7IGRhdGEgPSBmYWxzZSwgcGF5bG9hZCA9IGZhbHNlLCBwYWNrZXQgPSBmYWxzZSwgdG9rZW4gPSBmYWxzZSB9ID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5vcHRpb25zID0geyBkYXRhLCBwYXlsb2FkLCBwYWNrZXQsIHRva2VuIH07XG4gICAgdGhpcy5pbmRlbnQgPSAnICAnO1xuICB9XG5cbiAgcGFja2V0KGRpcmVjdGlvbjogJ1JlY2VpdmVkJyB8ICdTZW50JywgcGFja2V0OiBQYWNrZXQpIHtcbiAgICBpZiAodGhpcy5oYXZlTGlzdGVuZXJzKCkgJiYgdGhpcy5vcHRpb25zLnBhY2tldCkge1xuICAgICAgdGhpcy5sb2coJycpO1xuICAgICAgdGhpcy5sb2coZGlyZWN0aW9uKTtcbiAgICAgIHRoaXMubG9nKHBhY2tldC5oZWFkZXJUb1N0cmluZyh0aGlzLmluZGVudCkpO1xuICAgIH1cbiAgfVxuXG4gIGRhdGEocGFja2V0OiBQYWNrZXQpIHtcbiAgICBpZiAodGhpcy5oYXZlTGlzdGVuZXJzKCkgJiYgdGhpcy5vcHRpb25zLmRhdGEpIHtcbiAgICAgIHRoaXMubG9nKHBhY2tldC5kYXRhVG9TdHJpbmcodGhpcy5pbmRlbnQpKTtcbiAgICB9XG4gIH1cblxuICBwYXlsb2FkKGdlbmVyYXRlUGF5bG9hZFRleHQ6ICgpID0+IHN0cmluZykge1xuICAgIGlmICh0aGlzLmhhdmVMaXN0ZW5lcnMoKSAmJiB0aGlzLm9wdGlvbnMucGF5bG9hZCkge1xuICAgICAgdGhpcy5sb2coZ2VuZXJhdGVQYXlsb2FkVGV4dCgpKTtcbiAgICB9XG4gIH1cblxuICB0b2tlbih0b2tlbjogVG9rZW4pIHtcbiAgICBpZiAodGhpcy5oYXZlTGlzdGVuZXJzKCkgJiYgdGhpcy5vcHRpb25zLnRva2VuKSB7XG4gICAgICB0aGlzLmxvZyh1dGlsLmluc3BlY3QodG9rZW4sIHsgc2hvd0hpZGRlbjogZmFsc2UsIGRlcHRoOiA1LCBjb2xvcnM6IHRydWUgfSkpO1xuICAgIH1cbiAgfVxuXG4gIGhhdmVMaXN0ZW5lcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMubGlzdGVuZXJzKCdkZWJ1ZycpLmxlbmd0aCA+IDA7XG4gIH1cblxuICBsb2codGV4dDogc3RyaW5nKSB7XG4gICAgdGhpcy5lbWl0KCdkZWJ1ZycsIHRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERlYnVnO1xubW9kdWxlLmV4cG9ydHMgPSBEZWJ1ZztcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsT0FBQSxHQUFBQyxPQUFBO0FBQ0EsSUFBQUMsSUFBQSxHQUFBQyx1QkFBQSxDQUFBRixPQUFBO0FBQTZCLFNBQUFFLHdCQUFBQyxDQUFBLEVBQUFDLENBQUEsNkJBQUFDLE9BQUEsTUFBQUMsQ0FBQSxPQUFBRCxPQUFBLElBQUFFLENBQUEsT0FBQUYsT0FBQSxZQUFBSCx1QkFBQSxZQUFBQSxDQUFBQyxDQUFBLEVBQUFDLENBQUEsU0FBQUEsQ0FBQSxJQUFBRCxDQUFBLElBQUFBLENBQUEsQ0FBQUssVUFBQSxTQUFBTCxDQUFBLE1BQUFNLENBQUEsRUFBQUMsQ0FBQSxFQUFBQyxDQUFBLEtBQUFDLFNBQUEsUUFBQUMsT0FBQSxFQUFBVixDQUFBLGlCQUFBQSxDQUFBLHVCQUFBQSxDQUFBLHlCQUFBQSxDQUFBLFNBQUFRLENBQUEsTUFBQUYsQ0FBQSxHQUFBTCxDQUFBLEdBQUFHLENBQUEsR0FBQUQsQ0FBQSxRQUFBRyxDQUFBLENBQUFLLEdBQUEsQ0FBQVgsQ0FBQSxVQUFBTSxDQUFBLENBQUFNLEdBQUEsQ0FBQVosQ0FBQSxHQUFBTSxDQUFBLENBQUFPLEdBQUEsQ0FBQWIsQ0FBQSxF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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/sender.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sendInParallel = sendInParallel;
exports.sendMessage = sendMessage;
var _dgram = _interopRequireDefault(__turbopack_context__.r("[externals]/dgram [external] (dgram, cjs)"));
var _net = _interopRequireDefault(__turbopack_context__.r("[externals]/net [external] (net, cjs)"));
var _nodeUrl = _interopRequireDefault(__turbopack_context__.r("[externals]/node:url [external] (node:url, cjs)"));
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
async function sendInParallel(addresses, port, request, signal) {
    signal.throwIfAborted();
    return await new Promise((resolve, reject)=>{
        const sockets = [];
        let errorCount = 0;
        const onError = (err)=>{
            errorCount++;
            if (errorCount === addresses.length) {
                signal.removeEventListener('abort', onAbort);
                clearSockets();
                reject(err);
            }
        };
        const onMessage = (message)=>{
            signal.removeEventListener('abort', onAbort);
            clearSockets();
            resolve(message);
        };
        const onAbort = ()=>{
            clearSockets();
            reject(signal.reason);
        };
        const clearSockets = ()=>{
            for (const socket of sockets){
                socket.removeListener('error', onError);
                socket.removeListener('message', onMessage);
                socket.close();
            }
        };
        signal.addEventListener('abort', onAbort, {
            once: true
        });
        for(let j = 0; j < addresses.length; j++){
            const udpType = addresses[j].family === 6 ? 'udp6' : 'udp4';
            const socket = _dgram.default.createSocket(udpType);
            sockets.push(socket);
            socket.on('error', onError);
            socket.on('message', onMessage);
            socket.send(request, 0, request.length, port, addresses[j].address);
        }
    });
}
async function sendMessage(host, port, lookup, signal, request) {
    signal.throwIfAborted();
    let addresses;
    if (_net.default.isIP(host)) {
        addresses = [
            {
                address: host,
                family: _net.default.isIPv6(host) ? 6 : 4
            }
        ];
    } else {
        addresses = await new Promise((resolve, reject)=>{
            const onAbort = ()=>{
                reject(signal.reason);
            };
            const domainInASCII = _nodeUrl.default.domainToASCII(host);
            lookup(domainInASCII === '' ? host : domainInASCII, {
                all: true
            }, (err, addresses)=>{
                signal.removeEventListener('abort', onAbort);
                err ? reject(err) : resolve(addresses);
            });
        });
    }
    return await sendInParallel(addresses, port, request, signal);
} //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGdyYW0iLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9uZXQiLCJfbm9kZVVybCIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsInNlbmRJblBhcmFsbGVsIiwiYWRkcmVzc2VzIiwicG9ydCIsInJlcXVlc3QiLCJzaWduYWwiLCJ0aHJvd0lmQWJvcnRlZCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic29ja2V0cyIsImVycm9yQ291bnQiLCJvbkVycm9yIiwiZXJyIiwibGVuZ3RoIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm9uQWJvcnQiLCJjbGVhclNvY2tldHMiLCJvbk1lc3NhZ2UiLCJtZXNzYWdlIiwicmVhc29uIiwic29ja2V0IiwicmVtb3ZlTGlzdGVuZXIiLCJjbG9zZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbmNlIiwiaiIsInVkcFR5cGUiLCJmYW1pbHkiLCJkZ3JhbSIsImNyZWF0ZVNvY2tldCIsInB1c2giLCJvbiIsInNlbmQiLCJhZGRyZXNzIiwic2VuZE1lc3NhZ2UiLCJob3N0IiwibG9va3VwIiwibmV0IiwiaXNJUCIsImlzSVB2NiIsImRvbWFpbkluQVNDSUkiLCJ1cmwiLCJkb21haW5Ub0FTQ0lJIiwiYWxsIl0sInNvdXJjZXMiOlsiLi4vc3JjL3NlbmRlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZGdyYW0gZnJvbSAnZGdyYW0nO1xuaW1wb3J0IGRucyBmcm9tICdkbnMnO1xuaW1wb3J0IG5ldCBmcm9tICduZXQnO1xuaW1wb3J0IHVybCBmcm9tICdub2RlOnVybCc7XG5cbnR5cGUgTG9va3VwRnVuY3Rpb24gPSAoaG9zdG5hbWU6IHN0cmluZywgb3B0aW9uczogZG5zLkxvb2t1cEFsbE9wdGlvbnMsIGNhbGxiYWNrOiAoZXJyOiBOb2RlSlMuRXJybm9FeGNlcHRpb24gfCBudWxsLCBhZGRyZXNzZXM6IGRucy5Mb29rdXBBZGRyZXNzW10pID0+IHZvaWQpID0+IHZvaWQ7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kSW5QYXJhbGxlbChhZGRyZXNzZXM6IGRucy5Mb29rdXBBZGRyZXNzW10sIHBvcnQ6IG51bWJlciwgcmVxdWVzdDogQnVmZmVyLCBzaWduYWw6IEFib3J0U2lnbmFsKSB7XG4gIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZTxCdWZmZXI+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBzb2NrZXRzOiBkZ3JhbS5Tb2NrZXRbXSA9IFtdO1xuXG4gICAgbGV0IGVycm9yQ291bnQgPSAwO1xuXG4gICAgY29uc3Qgb25FcnJvciA9IChlcnI6IEVycm9yKSA9PiB7XG4gICAgICBlcnJvckNvdW50Kys7XG5cbiAgICAgIGlmIChlcnJvckNvdW50ID09PSBhZGRyZXNzZXMubGVuZ3RoKSB7XG4gICAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuICAgICAgICBjbGVhclNvY2tldHMoKTtcblxuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3Qgb25NZXNzYWdlID0gKG1lc3NhZ2U6IEJ1ZmZlcikgPT4ge1xuICAgICAgc2lnbmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCk7XG4gICAgICBjbGVhclNvY2tldHMoKTtcblxuICAgICAgcmVzb2x2ZShtZXNzYWdlKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb25BYm9ydCA9ICgpID0+IHtcbiAgICAgIGNsZWFyU29ja2V0cygpO1xuXG4gICAgICByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgfTtcblxuICAgIGNvbnN0IGNsZWFyU29ja2V0cyA9ICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc29ja2V0IG9mIHNvY2tldHMpIHtcbiAgICAgICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ21lc3NhZ2UnLCBvbk1lc3NhZ2UpO1xuICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBhZGRyZXNzZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGNvbnN0IHVkcFR5cGUgPSBhZGRyZXNzZXNbal0uZmFtaWx5ID09PSA2ID8gJ3VkcDYnIDogJ3VkcDQnO1xuXG4gICAgICBjb25zdCBzb2NrZXQgPSBkZ3JhbS5jcmVhdGVTb2NrZXQodWRwVHlwZSk7XG4gICAgICBzb2NrZXRzLnB1c2goc29ja2V0KTtcbiAgICAgIHNvY2tldC5vbignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgIHNvY2tldC5vbignbWVzc2FnZScsIG9uTWVzc2FnZSk7XG4gICAgICBzb2NrZXQuc2VuZChyZXF1ZXN0LCAwLCByZXF1ZXN0Lmxlbmd0aCwgcG9ydCwgYWRkcmVzc2VzW2pdLmFkZHJlc3MpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kTWVzc2FnZShob3N0OiBzdHJpbmcsIHBvcnQ6IG51bWJlciwgbG9va3VwOiBMb29rdXBGdW5jdGlvbiwgc2lnbmFsOiBBYm9ydFNpZ25hbCwgcmVxdWVzdDogQnVmZmVyKSB7XG4gIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gIGxldCBhZGRyZXNzZXM6IGRucy5Mb29rdXBBZGRyZXNzW107XG5cbiAgaWYgKG5ldC5pc0lQKGhvc3QpKSB7XG4gICAgYWRkcmVzc2VzID0gW1xuICAgICAgeyBhZGRyZXNzOiBob3N0LCBmYW1pbHk6IG5ldC5pc0lQdjYoaG9zdCkgPyA2IDogNCB9XG4gICAgXTtcbiAgfSBlbHNlIHtcbiAgICBhZGRyZXNzZXMgPSBhd2FpdCBuZXcgUHJvbWlzZTxkbnMuTG9va3VwQWRkcmVzc1tdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvbkFib3J0ID0gKCkgPT4ge1xuICAgICAgICByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBkb21haW5JbkFTQ0lJID0gdXJsLmRvbWFpblRvQVNDSUkoaG9zdCk7XG4gICAgICBsb29rdXAoZG9tYWluSW5BU0NJSSA9PT0gJycgPyBob3N0IDogZG9tYWluSW5BU0NJSSwgeyBhbGw6IHRydWUgfSwgKGVyciwgYWRkcmVzc2VzKSA9PiB7XG4gICAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuXG4gICAgICAgIGVyciA/IHJlamVjdChlcnIpIDogcmVzb2x2ZShhZGRyZXNzZXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gYXdhaXQgc2VuZEluUGFyYWxsZWwoYWRkcmVzc2VzLCBwb3J0LCByZXF1ZXN0LCBzaWduYWwpO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsSUFBQUEsTUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBRUEsSUFBQUMsSUFBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUUsUUFBQSxHQUFBSCxzQkFBQSxDQUFBQyxPQUFBO0FBQTJCLFNBQUFELHVCQUFBSSxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBSXBCLGVBQWVHLGNBQWNBLENBQUNDLFNBQThCLEVBQUVDLElBQVksRUFBRUMsT0FBZSxFQUFFQyxNQUFtQixFQUFFO0VBQ3ZIQSxNQUFNLENBQUNDLGNBQWMsQ0FBQyxDQUFDO0VBRXZCLE9BQU8sTUFBTSxJQUFJQyxPQUFPLENBQVMsQ0FBQ0MsT0FBTyxFQUFFQyxNQUFNLEtBQUs7SUFDcEQsTUFBTUMsT0FBdUIsR0FBRyxFQUFFO0lBRWxDLElBQUlDLFVBQVUsR0FBRyxDQUFDO0lBRWxC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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/instance-lookup.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.instanceLookup = instanceLookup;
exports.parseBrowserResponse = parseBrowserResponse;
var _dns = _interopRequireDefault(__turbopack_context__.r("[externals]/dns [external] (dns, cjs)"));
var _sender = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/sender.js [app-route] (ecmascript)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
const SQL_SERVER_BROWSER_PORT = 1434;
const TIMEOUT = 2 * 1000;
const RETRIES = 3;
// There are three bytes at the start of the response, whose purpose is unknown.
const MYSTERY_HEADER_LENGTH = 3;
// Most of the functionality has been determined from from jTDS's MSSqlServerInfo class.
async function instanceLookup(options) {
    const server = options.server;
    if (typeof server !== 'string') {
        throw new TypeError('Invalid arguments: "server" must be a string');
    }
    const instanceName = options.instanceName;
    if (typeof instanceName !== 'string') {
        throw new TypeError('Invalid arguments: "instanceName" must be a string');
    }
    const timeout = options.timeout === undefined ? TIMEOUT : options.timeout;
    if (typeof timeout !== 'number') {
        throw new TypeError('Invalid arguments: "timeout" must be a number');
    }
    const retries = options.retries === undefined ? RETRIES : options.retries;
    if (typeof retries !== 'number') {
        throw new TypeError('Invalid arguments: "retries" must be a number');
    }
    if (options.lookup !== undefined && typeof options.lookup !== 'function') {
        throw new TypeError('Invalid arguments: "lookup" must be a function');
    }
    const lookup = options.lookup ?? _dns.default.lookup;
    if (options.port !== undefined && typeof options.port !== 'number') {
        throw new TypeError('Invalid arguments: "port" must be a number');
    }
    const port = options.port ?? SQL_SERVER_BROWSER_PORT;
    const signal = options.signal;
    signal.throwIfAborted();
    let response;
    const request = Buffer.from([
        0x02
    ]);
    for(let i = 0; i <= retries; i++){
        const timeoutSignal = AbortSignal.timeout(timeout);
        try {
            response = await (0, _sender.sendMessage)(options.server, port, lookup, AbortSignal.any([
                signal,
                timeoutSignal
            ]), request);
        } catch (err) {
            // If the current attempt timed out, continue with the next
            if (timeoutSignal.aborted) {
                continue;
            }
            throw err;
        }
    }
    if (!response) {
        throw new Error('Failed to get response from SQL Server Browser on ' + server);
    }
    const message = response.toString('ascii', MYSTERY_HEADER_LENGTH);
    const foundPort = parseBrowserResponse(message, instanceName);
    if (!foundPort) {
        throw new Error('Port for ' + instanceName + ' not found in ' + options.server);
    }
    return foundPort;
}
function parseBrowserResponse(response, instanceName) {
    let getPort;
    const instances = response.split(';;');
    for(let i = 0, len = instances.length; i < len; i++){
        const instance = instances[i];
        const parts = instance.split(';');
        for(let p = 0, partsLen = parts.length; p < partsLen; p += 2){
            const name = parts[p];
            const value = parts[p + 1];
            if (name === 'tcp' && getPort) {
                const port = parseInt(value, 10);
                return port;
            }
            if (name === 'InstanceName') {
                if (value.toUpperCase() === instanceName.toUpperCase()) {
                    getPort = true;
                } else {
                    getPort = false;
                }
            }
        }
    }
} //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZG5zIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfc2VuZGVyIiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiU1FMX1NFUlZFUl9CUk9XU0VSX1BPUlQiLCJUSU1FT1VUIiwiUkVUUklFUyIsIk1ZU1RFUllfSEVBREVSX0xFTkdUSCIsImluc3RhbmNlTG9va3VwIiwib3B0aW9ucyIsInNlcnZlciIsIlR5cGVFcnJvciIsImluc3RhbmNlTmFtZSIsInRpbWVvdXQiLCJ1bmRlZmluZWQiLCJyZXRyaWVzIiwibG9va3VwIiwiZG5zIiwicG9ydCIsInNpZ25hbCIsInRocm93SWZBYm9ydGVkIiwicmVzcG9uc2UiLCJyZXF1ZXN0IiwiQnVmZmVyIiwiZnJvbSIsImkiLCJ0aW1lb3V0U2lnbmFsIiwiQWJvcnRTaWduYWwiLCJzZW5kTWVzc2FnZSIsImFueSIsImVyciIsImFib3J0ZWQiLCJFcnJvciIsIm1lc3NhZ2UiLCJ0b1N0cmluZyIsImZvdW5kUG9ydCIsInBhcnNlQnJvd3NlclJlc3BvbnNlIiwiZ2V0UG9ydCIsImluc3RhbmNlcyIsInNwbGl0IiwibGVuIiwibGVuZ3RoIiwiaW5zdGFuY2UiLCJwYXJ0cyIsInAiLCJwYXJ0c0xlbiIsIm5hbWUiLCJ2YWx1ZSIsInBhcnNlSW50IiwidG9VcHBlckNhc2UiXSwic291cmNlcyI6WyIuLi9zcmMvaW5zdGFuY2UtbG9va3VwLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBkbnMgZnJvbSAnZG5zJztcblxuaW1wb3J0IHsgc2VuZE1lc3NhZ2UgfSBmcm9tICcuL3NlbmRlcic7XG5cbmNvbnN0IFNRTF9TRVJWRVJfQlJPV1NFUl9QT1JUID0gMTQzNDtcbmNvbnN0IFRJTUVPVVQgPSAyICogMTAwMDtcbmNvbnN0IFJFVFJJRVMgPSAzO1xuLy8gVGhlcmUgYXJlIHRocmVlIGJ5dGVzIGF0IHRoZSBzdGFydCBvZiB0aGUgcmVzcG9uc2UsIHdob3NlIHB1cnBvc2UgaXMgdW5rbm93bi5cbmNvbnN0IE1ZU1RFUllfSEVBREVSX0xFTkdUSCA9IDM7XG5cbnR5cGUgTG9va3VwRnVuY3Rpb24gPSAoaG9zdG5hbWU6IHN0cmluZywgb3B0aW9uczogZG5zLkxvb2t1cEFsbE9wdGlvbnMsIGNhbGxiYWNrOiAoZXJyOiBOb2RlSlMuRXJybm9FeGNlcHRpb24gfCBudWxsLCBhZGRyZXNzZXM6IGRucy5Mb29rdXBBZGRyZXNzW10pID0+IHZvaWQpID0+IHZvaWQ7XG5cbi8vIE1vc3Qgb2YgdGhlIGZ1bmN0aW9uYWxpdHkgaGFzIGJlZW4gZGV0ZXJtaW5lZCBmcm9tIGZyb20galREUydzIE1TU3FsU2VydmVySW5mbyBjbGFzcy5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbnN0YW5jZUxvb2t1cChvcHRpb25zOiB7IHNlcnZlcjogc3RyaW5nLCBpbnN0YW5jZU5hbWU6IHN0cmluZywgdGltZW91dD86IG51bWJlciwgcmV0cmllcz86IG51bWJlciwgcG9ydD86IG51bWJlciwgbG9va3VwPzogTG9va3VwRnVuY3Rpb24sIHNpZ25hbDogQWJvcnRTaWduYWwgfSkge1xuICBjb25zdCBzZXJ2ZXIgPSBvcHRpb25zLnNlcnZlcjtcbiAgaWYgKHR5cGVvZiBzZXJ2ZXIgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBhcmd1bWVudHM6IFwic2VydmVyXCIgbXVzdCBiZSBhIHN0cmluZycpO1xuICB9XG5cbiAgY29uc3QgaW5zdGFuY2VOYW1lID0gb3B0aW9ucy5pbnN0YW5jZU5hbWU7XG4gIGlmICh0eXBlb2YgaW5zdGFuY2VOYW1lICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzOiBcImluc3RhbmNlTmFtZVwiIG11c3QgYmUgYSBzdHJpbmcnKTtcbiAgfVxuXG4gIGNvbnN0IHRpbWVvdXQgPSBvcHRpb25zLnRpbWVvdXQgPT09IHVuZGVmaW5lZCA/IFRJTUVPVVQgOiBvcHRpb25zLnRpbWVvdXQ7XG4gIGlmICh0eXBlb2YgdGltZW91dCAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFyZ3VtZW50czogXCJ0aW1lb3V0XCIgbXVzdCBiZSBhIG51bWJlcicpO1xuICB9XG5cbiAgY29uc3QgcmV0cmllcyA9IG9wdGlvbnMucmV0cmllcyA9PT0gdW5kZWZpbmVkID8gUkVUUklFUyA6IG9wdGlvbnMucmV0cmllcztcbiAgaWYgKHR5cGVvZiByZXRyaWVzICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzOiBcInJldHJpZXNcIiBtdXN0IGJlIGEgbnVtYmVyJyk7XG4gIH1cblxuICBpZiAob3B0aW9ucy5sb29rdXAgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5sb29rdXAgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdJbnZhbGlkIGFyZ3VtZW50czogXCJsb29rdXBcIiBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuICBjb25zdCBsb29rdXAgPSBvcHRpb25zLmxvb2t1cCA/PyBkbnMubG9va3VwO1xuXG4gIGlmIChvcHRpb25zLnBvcnQgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb3B0aW9ucy5wb3J0ICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgYXJndW1lbnRzOiBcInBvcnRcIiBtdXN0IGJlIGEgbnVtYmVyJyk7XG4gIH1cbiAgY29uc3QgcG9ydCA9IG9wdGlvbnMucG9ydCA/PyBTUUxfU0VSVkVSX0JST1dTRVJfUE9SVDtcblxuICBjb25zdCBzaWduYWwgPSBvcHRpb25zLnNpZ25hbDtcblxuICBzaWduYWwudGhyb3dJZkFib3J0ZWQoKTtcblxuICBsZXQgcmVzcG9uc2U7XG5cbiAgY29uc3QgcmVxdWVzdCA9IEJ1ZmZlci5mcm9tKFsweDAyXSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPD0gcmV0cmllczsgaSsrKSB7XG4gICAgY29uc3QgdGltZW91dFNpZ25hbCA9IEFib3J0U2lnbmFsLnRpbWVvdXQodGltZW91dCk7XG5cbiAgICB0cnkge1xuICAgICAgcmVzcG9uc2UgPSBhd2FpdCBzZW5kTWVzc2FnZShvcHRpb25zLnNlcnZlciwgcG9ydCwgbG9va3VwLCBBYm9ydFNpZ25hbC5hbnkoWyBzaWduYWwsIHRpbWVvdXRTaWduYWwgXSksIHJlcXVlc3QpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gSWYgdGhlIGN1cnJlbnQgYXR0ZW1wdCB0aW1lZCBvdXQsIGNvbnRpbnVlIHdpdGggdGhlIG5leHRcbiAgICAgIGlmICh0aW1lb3V0U2lnbmFsLmFib3J0ZWQpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycjtcbiAgICB9XG4gIH1cblxuICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZ2V0IHJlc3BvbnNlIGZyb20gU1FMIFNlcnZlciBCcm93c2VyIG9uICcgKyBzZXJ2ZXIpO1xuICB9XG5cbiAgY29uc3QgbWVzc2FnZSA9IHJlc3BvbnNlLnRvU3RyaW5nKCdhc2NpaScsIE1ZU1RFUllfSEVBREVSX0xFTkdUSCk7XG4gIGNvbnN0IGZvdW5kUG9ydCA9IHBhcnNlQnJvd3NlclJlc3BvbnNlKG1lc3NhZ2UsIGluc3RhbmNlTmFtZSk7XG5cbiAgaWYgKCFmb3VuZFBvcnQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1BvcnQgZm9yICcgKyBpbnN0YW5jZU5hbWUgKyAnIG5vdCBmb3VuZCBpbiAnICsgb3B0aW9ucy5zZXJ2ZXIpO1xuICB9XG5cbiAgcmV0dXJuIGZvdW5kUG9ydDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlQnJvd3NlclJlc3BvbnNlKHJlc3BvbnNlOiBzdHJpbmcsIGluc3RhbmNlTmFtZTogc3RyaW5nKSB7XG4gIGxldCBnZXRQb3J0O1xuXG4gIGNvbnN0IGluc3RhbmNlcyA9IHJlc3BvbnNlLnNwbGl0KCc7OycpO1xuICBmb3IgKGxldCBpID0gMCwgbGVuID0gaW5zdGFuY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29uc3QgaW5zdGFuY2UgPSBpbnN0YW5jZXNbaV07XG4gICAgY29uc3QgcGFydHMgPSBpbnN0YW5jZS5zcGxpdCgnOycpO1xuXG4gICAgZm9yIChsZXQgcCA9IDAsIHBhcnRzTGVuID0gcGFydHMubGVuZ3RoOyBwIDwgcGFydHNMZW47IHAgKz0gMikge1xuICAgICAgY29uc3QgbmFtZSA9IHBhcnRzW3BdO1xuICAgICAgY29uc3QgdmFsdWUgPSBwYXJ0c1twICsgMV07XG5cbiAgICAgIGlmIChuYW1lID09PSAndGNwJyAmJiBnZXRQb3J0KSB7XG4gICAgICAgIGNvbnN0IHBvcnQgPSBwYXJzZUludCh2YWx1ZSwgMTApO1xuICAgICAgICByZXR1cm4gcG9ydDtcbiAgICAgIH1cblxuICAgICAgaWYgKG5hbWUgPT09ICdJbnN0YW5jZU5hbWUnKSB7XG4gICAgICAgIGlmICh2YWx1ZS50b1VwcGVyQ2FzZSgpID09PSBpbnN0YW5jZU5hbWUudG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgIGdldFBvcnQgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdldFBvcnQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsSUFBQUEsSUFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBRUEsSUFBQUMsT0FBQSxHQUFBRCxPQUFBO0FBQXVDLFNBQUFELHVCQUFBRyxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBRXZDLE1BQU1HLHVCQUF1QixHQUFHLElBQUk7QUFDcEMsTUFBTUMsT0FBTyxHQUFHLENBQUMsR0FBRyxJQUFJO0FBQ3hCLE1BQU1DLE9BQU8sR0FBRyxDQUFDO0FBQ2pCO0FBQ0Es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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/transient-error-lookup.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TransientErrorLookup = void 0;
// This simple piece of code is factored out into a separate class to make it
// easy to stub it out in tests. It's hard, if not impossible, to cause a
// transient error on demand in tests.
class TransientErrorLookup {
    isTransientError(error) {
        // This list of transient errors comes from Microsoft implementation of SqlClient:
        //  - https://github.com/dotnet/corefx/blob/master/src/System.Data.SqlClient/src/System/Data/SqlClient/SqlInternalConnectionTds.cs#L115
        const transientErrors = [
            4060,
            10928,
            10929,
            40197,
            40501,
            40613
        ];
        return transientErrors.indexOf(error) !== -1;
    }
}
exports.TransientErrorLookup = TransientErrorLookup; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUcmFuc2llbnRFcnJvckxvb2t1cCIsImlzVHJhbnNpZW50RXJyb3IiLCJlcnJvciIsInRyYW5zaWVudEVycm9ycyIsImluZGV4T2YiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiLi4vc3JjL3RyYW5zaWVudC1lcnJvci1sb29rdXAudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBzaW1wbGUgcGllY2Ugb2YgY29kZSBpcyBmYWN0b3JlZCBvdXQgaW50byBhIHNlcGFyYXRlIGNsYXNzIHRvIG1ha2UgaXRcbi8vIGVhc3kgdG8gc3R1YiBpdCBvdXQgaW4gdGVzdHMuIEl0J3MgaGFyZCwgaWYgbm90IGltcG9zc2libGUsIHRvIGNhdXNlIGFcbi8vIHRyYW5zaWVudCBlcnJvciBvbiBkZW1hbmQgaW4gdGVzdHMuXG5leHBvcnQgY2xhc3MgVHJhbnNpZW50RXJyb3JMb29rdXAge1xuICBpc1RyYW5zaWVudEVycm9yKGVycm9yOiBudW1iZXIpIHtcbiAgICAvLyBUaGlzIGxpc3Qgb2YgdHJhbnNpZW50IGVycm9ycyBjb21lcyBmcm9tIE1pY3Jvc29mdCBpbXBsZW1lbnRhdGlvbiBvZiBTcWxDbGllbnQ6XG4gICAgLy8gIC0gaHR0cHM6Ly9naXRodWIuY29tL2RvdG5ldC9jb3JlZngvYmxvYi9tYXN0ZXIvc3JjL1N5c3RlbS5EYXRhLlNxbENsaWVudC9zcmMvU3lzdGVtL0RhdGEvU3FsQ2xpZW50L1NxbEludGVybmFsQ29ubmVjdGlvblRkcy5jcyNMMTE1XG4gICAgY29uc3QgdHJhbnNpZW50RXJyb3JzID0gWzQwNjAsIDEwOTI4LCAxMDkyOSwgNDAxOTcsIDQwNTAxLCA0MDYxM107XG4gICAgcmV0dXJuIHRyYW5zaWVudEVycm9ycy5pbmRleE9mKGVycm9yKSAhPT0gLTE7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ08sTUFBTUEsb0JBQW9CLENBQUM7RUFDaENDLGdCQUFnQkEsQ0FBQ0MsS0FBYSxFQUFFO0lBQzlCO0lBQ0E7SUFDQSxNQUFNQyxlQUFlLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQztJQUNqRSxPQUFPQSxlQUFlLENBQUNDLE9BQU8sQ0FBQ0YsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzlDO0FBQ0Y7QUFBQ0csT0FBQSxDQUFBTCxvQkFBQSxHQUFBQSxvQkFBQSIsImlnbm9yZUxpc3QiOltdfQ==
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/packet.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TYPE = exports.Packet = exports.OFFSET = exports.HEADER_LENGTH = void 0;
exports.isPacketComplete = isPacketComplete;
exports.packetLength = packetLength;
var _sprintfJs = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/sprintf-js@1.1.3/node_modules/sprintf-js/src/sprintf.js [app-route] (ecmascript)");
const HEADER_LENGTH = exports.HEADER_LENGTH = 8;
const TYPE = exports.TYPE = {
    SQL_BATCH: 0x01,
    RPC_REQUEST: 0x03,
    TABULAR_RESULT: 0x04,
    ATTENTION: 0x06,
    BULK_LOAD: 0x07,
    TRANSACTION_MANAGER: 0x0E,
    LOGIN7: 0x10,
    NTLMAUTH_PKT: 0x11,
    PRELOGIN: 0x12,
    FEDAUTH_TOKEN: 0x08
};
const typeByValue = {};
for(const name in TYPE){
    typeByValue[TYPE[name]] = name;
}
const STATUS = {
    NORMAL: 0x00,
    EOM: 0x01,
    IGNORE: 0x02,
    RESETCONNECTION: 0x08,
    RESETCONNECTIONSKIPTRAN: 0x10
};
const OFFSET = exports.OFFSET = {
    Type: 0,
    Status: 1,
    Length: 2,
    SPID: 4,
    PacketID: 6,
    Window: 7
};
const DEFAULT_SPID = 0;
const DEFAULT_PACKETID = 1;
const DEFAULT_WINDOW = 0;
const NL = '\n';
class Packet {
    constructor(typeOrBuffer){
        if (typeOrBuffer instanceof Buffer) {
            this.buffer = typeOrBuffer;
        } else {
            const type = typeOrBuffer;
            this.buffer = Buffer.alloc(HEADER_LENGTH, 0);
            this.buffer.writeUInt8(type, OFFSET.Type);
            this.buffer.writeUInt8(STATUS.NORMAL, OFFSET.Status);
            this.buffer.writeUInt16BE(DEFAULT_SPID, OFFSET.SPID);
            this.buffer.writeUInt8(DEFAULT_PACKETID, OFFSET.PacketID);
            this.buffer.writeUInt8(DEFAULT_WINDOW, OFFSET.Window);
            this.setLength();
        }
    }
    setLength() {
        this.buffer.writeUInt16BE(this.buffer.length, OFFSET.Length);
    }
    length() {
        return this.buffer.readUInt16BE(OFFSET.Length);
    }
    resetConnection(reset) {
        let status = this.buffer.readUInt8(OFFSET.Status);
        if (reset) {
            status |= STATUS.RESETCONNECTION;
        } else {
            status &= 0xFF - STATUS.RESETCONNECTION;
        }
        this.buffer.writeUInt8(status, OFFSET.Status);
    }
    last(last) {
        let status = this.buffer.readUInt8(OFFSET.Status);
        if (arguments.length > 0) {
            if (last) {
                status |= STATUS.EOM;
            } else {
                status &= 0xFF - STATUS.EOM;
            }
            this.buffer.writeUInt8(status, OFFSET.Status);
        }
        return this.isLast();
    }
    ignore(last) {
        let status = this.buffer.readUInt8(OFFSET.Status);
        if (last) {
            status |= STATUS.IGNORE;
        } else {
            status &= 0xFF - STATUS.IGNORE;
        }
        this.buffer.writeUInt8(status, OFFSET.Status);
    }
    isLast() {
        return !!(this.buffer.readUInt8(OFFSET.Status) & STATUS.EOM);
    }
    packetId(packetId) {
        if (packetId) {
            this.buffer.writeUInt8(packetId % 256, OFFSET.PacketID);
        }
        return this.buffer.readUInt8(OFFSET.PacketID);
    }
    addData(data) {
        this.buffer = Buffer.concat([
            this.buffer,
            data
        ]);
        this.setLength();
        return this;
    }
    data() {
        return this.buffer.slice(HEADER_LENGTH);
    }
    type() {
        return this.buffer.readUInt8(OFFSET.Type);
    }
    statusAsString() {
        const status = this.buffer.readUInt8(OFFSET.Status);
        const statuses = [];
        for(const name in STATUS){
            const value = STATUS[name];
            if (status & value) {
                statuses.push(name);
            } else {
                statuses.push(undefined);
            }
        }
        return statuses.join(' ').trim();
    }
    headerToString(indent = '') {
        const text = (0, _sprintfJs.sprintf)('type:0x%02X(%s), status:0x%02X(%s), length:0x%04X, spid:0x%04X, packetId:0x%02X, window:0x%02X', this.buffer.readUInt8(OFFSET.Type), typeByValue[this.buffer.readUInt8(OFFSET.Type)], this.buffer.readUInt8(OFFSET.Status), this.statusAsString(), this.buffer.readUInt16BE(OFFSET.Length), this.buffer.readUInt16BE(OFFSET.SPID), this.buffer.readUInt8(OFFSET.PacketID), this.buffer.readUInt8(OFFSET.Window));
        return indent + text;
    }
    dataToString(indent = '') {
        const BYTES_PER_GROUP = 0x04;
        const CHARS_PER_GROUP = 0x08;
        const BYTES_PER_LINE = 0x20;
        const data = this.data();
        let dataDump = '';
        let chars = '';
        for(let offset = 0; offset < data.length; offset++){
            if (offset % BYTES_PER_LINE === 0) {
                dataDump += indent;
                dataDump += (0, _sprintfJs.sprintf)('%04X  ', offset);
            }
            if (data[offset] < 0x20 || data[offset] > 0x7E) {
                chars += '.';
                if ((offset + 1) % CHARS_PER_GROUP === 0 && !((offset + 1) % BYTES_PER_LINE === 0)) {
                    chars += ' ';
                }
            } else {
                chars += String.fromCharCode(data[offset]);
            }
            if (data[offset] != null) {
                dataDump += (0, _sprintfJs.sprintf)('%02X', data[offset]);
            }
            if ((offset + 1) % BYTES_PER_GROUP === 0 && !((offset + 1) % BYTES_PER_LINE === 0)) {
                dataDump += ' ';
            }
            if ((offset + 1) % BYTES_PER_LINE === 0) {
                dataDump += '  ' + chars;
                chars = '';
                if (offset < data.length - 1) {
                    dataDump += NL;
                }
            }
        }
        if (chars.length) {
            dataDump += '  ' + chars;
        }
        return dataDump;
    }
    toString(indent = '') {
        return this.headerToString(indent) + '\n' + this.dataToString(indent + indent);
    }
    payloadString() {
        return '';
    }
}
exports.Packet = Packet;
function isPacketComplete(potentialPacketBuffer) {
    if (potentialPacketBuffer.length < HEADER_LENGTH) {
        return false;
    } else {
        return potentialPacketBuffer.length >= potentialPacketBuffer.readUInt16BE(OFFSET.Length);
    }
}
function packetLength(potentialPacketBuffer) {
    return potentialPacketBuffer.readUInt16BE(OFFSET.Length);
} //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfc3ByaW50ZkpzIiwicmVxdWlyZSIsIkhFQURFUl9MRU5HVEgiLCJleHBvcnRzIiwiVFlQRSIsIlNRTF9CQVRDSCIsIlJQQ19SRVFVRVNUIiwiVEFCVUxBUl9SRVNVTFQiLCJBVFRFTlRJT04iLCJCVUxLX0xPQUQiLCJUUkFOU0FDVElPTl9NQU5BR0VSIiwiTE9HSU43IiwiTlRMTUFVVEhfUEtUIiwiUFJFTE9HSU4iLCJGRURBVVRIX1RPS0VOIiwidHlwZUJ5VmFsdWUiLCJuYW1lIiwiU1RBVFVTIiwiTk9STUFMIiwiRU9NIiwiSUdOT1JFIiwiUkVTRVRDT05ORUNUSU9OIiwiUkVTRVRDT05ORUNUSU9OU0tJUFRSQU4iLCJPRkZTRVQiLCJUeXBlIiwiU3RhdHVzIiwiTGVuZ3RoIiwiU1BJRCIsIlBhY2tldElEIiwiV2luZG93IiwiREVGQVVMVF9TUElEIiwiREVGQVVMVF9QQUNLRVRJRCIsIkRFRkFVTFRfV0lORE9XIiwiTkwiLCJQYWNrZXQiLCJjb25zdHJ1Y3RvciIsInR5cGVPckJ1ZmZlciIsIkJ1ZmZlciIsImJ1ZmZlciIsInR5cGUiLCJhbGxvYyIsIndyaXRlVUludDgiLCJ3cml0ZVVJbnQxNkJFIiwic2V0TGVuZ3RoIiwibGVuZ3RoIiwicmVhZFVJbnQxNkJFIiwicmVzZXRDb25uZWN0aW9uIiwicmVzZXQiLCJzdGF0dXMiLCJyZWFkVUludDgiLCJsYXN0IiwiYXJndW1lbnRzIiwiaXNMYXN0IiwiaWdub3JlIiwicGFja2V0SWQiLCJhZGREYXRhIiwiZGF0YSIsImNvbmNhdCIsInNsaWNlIiwic3RhdHVzQXNTdHJpbmciLCJzdGF0dXNlcyIsInZhbHVlIiwicHVzaCIsInVuZGVmaW5lZCIsImpvaW4iLCJ0cmltIiwiaGVhZGVyVG9TdHJpbmciLCJpbmRlbnQiLCJ0ZXh0Iiwic3ByaW50ZiIsImRhdGFUb1N0cmluZyIsIkJZVEVTX1BFUl9HUk9VUCIsIkNIQVJTX1BFUl9HUk9VUCIsIkJZVEVTX1BFUl9MSU5FIiwiZGF0YUR1bXAiLCJjaGFycyIsIm9mZnNldCIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsInRvU3RyaW5nIiwicGF5bG9hZFN0cmluZyIsImlzUGFja2V0Q29tcGxldGUiLCJwb3RlbnRpYWxQYWNrZXRCdWZmZXIiLCJwYWNrZXRMZW5ndGgiXSwic291cmNlcyI6WyIuLi9zcmMvcGFja2V0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNwcmludGYgfSBmcm9tICdzcHJpbnRmLWpzJztcblxuZXhwb3J0IGNvbnN0IEhFQURFUl9MRU5HVEggPSA4O1xuXG5leHBvcnQgY29uc3QgVFlQRTogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHtcbiAgU1FMX0JBVENIOiAweDAxLFxuICBSUENfUkVRVUVTVDogMHgwMyxcbiAgVEFCVUxBUl9SRVNVTFQ6IDB4MDQsXG4gIEFUVEVOVElPTjogMHgwNixcbiAgQlVMS19MT0FEOiAweDA3LFxuICBUUkFOU0FDVElPTl9NQU5BR0VSOiAweDBFLFxuICBMT0dJTjc6IDB4MTAsXG4gIE5UTE1BVVRIX1BLVDogMHgxMSxcbiAgUFJFTE9HSU46IDB4MTIsXG4gIEZFREFVVEhfVE9LRU46IDB4MDhcbn07XG5cbmNvbnN0IHR5cGVCeVZhbHVlOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9ID0ge307XG5cbmZvciAoY29uc3QgbmFtZSBpbiBUWVBFKSB7XG4gIHR5cGVCeVZhbHVlW1RZUEVbbmFtZV1dID0gbmFtZTtcbn1cblxuY29uc3QgU1RBVFVTOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge1xuICBOT1JNQUw6IDB4MDAsXG4gIEVPTTogMHgwMSxcbiAgSUdOT1JFOiAweDAyLFxuICBSRVNFVENPTk5FQ1RJT046IDB4MDgsXG4gIFJFU0VUQ09OTkVDVElPTlNLSVBUUkFOOiAweDEwXG59O1xuXG5leHBvcnQgY29uc3QgT0ZGU0VUID0ge1xuICBUeXBlOiAwLFxuICBTdGF0dXM6IDEsXG4gIExlbmd0aDogMixcbiAgU1BJRDogNCxcbiAgUGFja2V0SUQ6IDYsXG4gIFdpbmRvdzogN1xufTtcblxuY29uc3QgREVGQVVMVF9TUElEID0gMDtcblxuY29uc3QgREVGQVVMVF9QQUNLRVRJRCA9IDE7XG5cbmNvbnN0IERFRkFVTFRfV0lORE9XID0gMDtcblxuY29uc3QgTkwgPSAnXFxuJztcblxuZXhwb3J0IGNsYXNzIFBhY2tldCB7XG4gIGRlY2xhcmUgYnVmZmVyOiBCdWZmZXI7XG5cbiAgY29uc3RydWN0b3IodHlwZU9yQnVmZmVyOiBCdWZmZXIgfCBudW1iZXIpIHtcbiAgICBpZiAodHlwZU9yQnVmZmVyIGluc3RhbmNlb2YgQnVmZmVyKSB7XG4gICAgICB0aGlzLmJ1ZmZlciA9IHR5cGVPckJ1ZmZlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdHlwZSA9IHR5cGVPckJ1ZmZlciBhcyBudW1iZXI7XG4gICAgICB0aGlzLmJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyhIRUFERVJfTEVOR1RILCAwKTtcbiAgICAgIHRoaXMuYnVmZmVyLndyaXRlVUludDgodHlwZSwgT0ZGU0VULlR5cGUpO1xuICAgICAgdGhpcy5idWZmZXIud3JpdGVVSW50OChTVEFUVVMuTk9STUFMLCBPRkZTRVQuU3RhdHVzKTtcbiAgICAgIHRoaXMuYnVmZmVyLndyaXRlVUludDE2QkUoREVGQVVMVF9TUElELCBPRkZTRVQuU1BJRCk7XG4gICAgICB0aGlzLmJ1ZmZlci53cml0ZVVJbnQ4KERFRkFVTFRfUEFDS0VUSUQsIE9GRlNFVC5QYWNrZXRJRCk7XG4gICAgICB0aGlzLmJ1ZmZlci53cml0ZVVJbnQ4KERFRkFVTFRfV0lORE9XLCBPRkZTRVQuV2luZG93KTtcbiAgICAgIHRoaXMuc2V0TGVuZ3RoKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0TGVuZ3RoKCkge1xuICAgIHRoaXMuYnVmZmVyLndyaXRlVUludDE2QkUodGhpcy5idWZmZXIubGVuZ3RoLCBPRkZTRVQuTGVuZ3RoKTtcbiAgfVxuXG4gIGxlbmd0aCgpIHtcbiAgICByZXR1cm4gdGhpcy5idWZmZXIucmVhZFVJbnQxNkJFKE9GRlNFVC5MZW5ndGgpO1xuICB9XG5cbiAgcmVzZXRDb25uZWN0aW9uKHJlc2V0OiBib29sZWFuKSB7XG4gICAgbGV0IHN0YXR1cyA9IHRoaXMuYnVmZmVyLnJlYWRVSW50OChPRkZTRVQuU3RhdHVzKTtcbiAgICBpZiAocmVzZXQpIHtcbiAgICAgIHN0YXR1cyB8PSBTVEFUVVMuUkVTRVRDT05ORUNUSU9OO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdGF0dXMgJj0gMHhGRiAtIFNUQVRVUy5SRVNFVENPTk5FQ1RJT047XG4gICAgfVxuICAgIHRoaXMuYnVmZmVyLndyaXRlVUludDgoc3RhdHVzLCBPRkZTRVQuU3RhdHVzKTtcbiAgfVxuXG4gIGxhc3QobGFzdD86IGJvb2xlYW4pIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KE9GRlNFVC5TdGF0dXMpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKGxhc3QpIHtcbiAgICAgICAgc3RhdHVzIHw9IFNUQVRVUy5FT007XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0dXMgJj0gMHhGRiAtIFNUQVRVUy5FT007XG4gICAgICB9XG4gICAgICB0aGlzLmJ1ZmZlci53cml0ZVVJbnQ4KHN0YXR1cywgT0ZGU0VULlN0YXR1cyk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmlzTGFzdCgpO1xuICB9XG5cbiAgaWdub3JlKGxhc3Q6IGJvb2xlYW4pIHtcbiAgICBsZXQgc3RhdHVzID0gdGhpcy5idWZmZXIucmVhZFVJbnQ4KE9GRlNFVC5TdGF0dXMpO1xuICAgIGlmIChsYXN0KSB7XG4gICAgICBzdGF0dXMgfD0gU1RBVFVTLklHTk9SRTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3RhdHVzICY9IDB4RkYgLSBTVEFUVVMuSUdOT1JFO1xuICAgIH1cbiAgICB0aGlzLmJ1ZmZlci53cml0ZVVJbnQ4KHN0YXR1cywgT0ZGU0VULlN0YXR1cyk7XG4gIH1cblxuICBpc0xhc3QoKSB7XG4gICAgcmV0dXJuICEhKHRoaXMuYnVmZmVyLnJlYWRVSW50OChPRkZTRVQuU3RhdHVzKSAmIFNUQVRVUy5FT00pO1xuICB9XG5cbiAgcGFja2V0SWQocGFja2V0SWQ/OiBudW1iZXIpIHtcbiAgICBpZiAocGFja2V0SWQpIHtcbiAgICAgIHRoaXMuYnVmZmVyLndyaXRlVUludDgocGFja2V0SWQgJSAyNTYsIE9GRlNFVC5QYWNrZXRJRCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5yZWFkVUludDgoT0ZGU0VULlBhY2tldElEKTtcbiAgfVxuXG4gIGFkZERhdGEoZGF0YTogQnVmZmVyKSB7XG4gICAgdGhpcy5idWZmZXIgPSBCdWZmZXIuY29uY2F0KFt0aGlzLmJ1ZmZlciwgZGF0YV0pO1xuICAgIHRoaXMuc2V0TGVuZ3RoKCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBkYXRhKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5zbGljZShIRUFERVJfTEVOR1RIKTtcbiAgfVxuXG4gIHR5cGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLnJlYWRVSW50OChPRkZTRVQuVHlwZSk7XG4gIH1cblxuICBzdGF0dXNBc1N0cmluZygpIHtcbiAgICBjb25zdCBzdGF0dXMgPSB0aGlzLmJ1ZmZlci5yZWFkVUludDgoT0ZGU0VULlN0YXR1cyk7XG4gICAgY29uc3Qgc3RhdHVzZXMgPSBbXTtcblxuICAgIGZvciAoY29uc3QgbmFtZSBpbiBTVEFUVVMpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gU1RBVFVTW25hbWVdO1xuXG4gICAgICBpZiAoc3RhdHVzICYgdmFsdWUpIHtcbiAgICAgICAgc3RhdHVzZXMucHVzaChuYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXR1c2VzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHVzZXMuam9pbignICcpLnRyaW0oKTtcbiAgfVxuXG4gIGhlYWRlclRvU3RyaW5nKGluZGVudCA9ICcnKSB7XG4gICAgY29uc3QgdGV4dCA9IHNwcmludGYoJ3R5cGU6MHglMDJYKCVzKSwgc3RhdHVzOjB4JTAyWCglcyksIGxlbmd0aDoweCUwNFgsIHNwaWQ6MHglMDRYLCBwYWNrZXRJZDoweCUwMlgsIHdpbmRvdzoweCUwMlgnLCB0aGlzLmJ1ZmZlci5yZWFkVUludDgoT0ZGU0VULlR5cGUpLCB0eXBlQnlWYWx1ZVt0aGlzLmJ1ZmZlci5yZWFkVUludDgoT0ZGU0VULlR5cGUpXSwgdGhpcy5idWZmZXIucmVhZFVJbnQ4KE9GRlNFVC5TdGF0dXMpLCB0aGlzLnN0YXR1c0FzU3RyaW5nKCksIHRoaXMuYnVmZmVyLnJlYWRVSW50MTZCRShPRkZTRVQuTGVuZ3RoKSwgdGhpcy5idWZmZXIucmVhZFVJbnQxNkJFKE9GRlNFVC5TUElEKSwgdGhpcy5idWZmZXIucmVhZFVJbnQ4KE9GRlNFVC5QYWNrZXRJRCksIHRoaXMuYnVmZmVyLnJlYWRVSW50OChPRkZTRVQuV2luZG93KSk7XG4gICAgcmV0dXJuIGluZGVudCArIHRleHQ7XG4gIH1cblxuICBkYXRhVG9TdHJpbmcoaW5kZW50ID0gJycpIHtcbiAgICBjb25zdCBCWVRFU19QRVJfR1JPVVAgPSAweDA0O1xuICAgIGNvbnN0IENIQVJTX1BFUl9HUk9VUCA9IDB4MDg7XG4gICAgY29uc3QgQllURVNfUEVSX0xJTkUgPSAweDIwO1xuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmRhdGEoKTtcblxuICAgIGxldCBkYXRhRHVtcCA9ICcnO1xuICAgIGxldCBjaGFycyA9ICcnO1xuXG5cbiAgICBmb3IgKGxldCBvZmZzZXQgPSAwOyBvZmZzZXQgPCBkYXRhLmxlbmd0aDsgb2Zmc2V0KyspIHtcbiAgICAgIGlmIChvZmZzZXQgJSBCWVRFU19QRVJfTElORSA9PT0gMCkge1xuICAgICAgICBkYXRhRHVtcCArPSBpbmRlbnQ7XG4gICAgICAgIGRhdGFEdW1wICs9IHNwcmludGYoJyUwNFggICcsIG9mZnNldCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhW29mZnNldF0gPCAweDIwIHx8IGRhdGFbb2Zmc2V0XSA+IDB4N0UpIHtcbiAgICAgICAgY2hhcnMgKz0gJy4nO1xuICAgICAgICBpZiAoKChvZmZzZXQgKyAxKSAlIENIQVJTX1BFUl9HUk9VUCA9PT0gMCkgJiYgISgob2Zmc2V0ICsgMSkgJSBCWVRFU19QRVJfTElORSA9PT0gMCkpIHtcbiAgICAgICAgICBjaGFycyArPSAnICc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNoYXJzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoZGF0YVtvZmZzZXRdKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhdGFbb2Zmc2V0XSAhPSBudWxsKSB7XG4gICAgICAgIGRhdGFEdW1wICs9IHNwcmludGYoJyUwMlgnLCBkYXRhW29mZnNldF0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoKChvZmZzZXQgKyAxKSAlIEJZVEVTX1BFUl9HUk9VUCA9PT0gMCkgJiYgISgob2Zmc2V0ICsgMSkgJSBCWVRFU19QRVJfTElORSA9PT0gMCkpIHtcbiAgICAgICAgZGF0YUR1bXAgKz0gJyAnO1xuICAgICAgfVxuXG4gICAgICBpZiAoKG9mZnNldCArIDEpICUgQllURVNfUEVSX0xJTkUgPT09IDApIHtcbiAgICAgICAgZGF0YUR1bXAgKz0gJyAgJyArIGNoYXJzO1xuICAgICAgICBjaGFycyA9ICcnO1xuICAgICAgICBpZiAob2Zmc2V0IDwgZGF0YS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgZGF0YUR1bXAgKz0gTkw7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2hhcnMubGVuZ3RoKSB7XG4gICAgICBkYXRhRHVtcCArPSAnICAnICsgY2hhcnM7XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGFEdW1wO1xuICB9XG5cbiAgdG9TdHJpbmcoaW5kZW50ID0gJycpIHtcbiAgICByZXR1cm4gdGhpcy5oZWFkZXJUb1N0cmluZyhpbmRlbnQpICsgJ1xcbicgKyB0aGlzLmRhdGFUb1N0cmluZyhpbmRlbnQgKyBpbmRlbnQpO1xuICB9XG5cbiAgcGF5bG9hZFN0cmluZygpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUGFja2V0Q29tcGxldGUocG90ZW50aWFsUGFja2V0QnVmZmVyOiBCdWZmZXIpIHtcbiAgaWYgKHBvdGVudGlhbFBhY2tldEJ1ZmZlci5sZW5ndGggPCBIRUFERVJfTEVOR1RIKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwb3RlbnRpYWxQYWNrZXRCdWZmZXIubGVuZ3RoID49IHBvdGVudGlhbFBhY2tldEJ1ZmZlci5yZWFkVUludDE2QkUoT0ZGU0VULkxlbmd0aCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhY2tldExlbmd0aChwb3RlbnRpYWxQYWNrZXRCdWZmZXI6IEJ1ZmZlcikge1xuICByZXR1cm4gcG90ZW50aWFsUGFja2V0QnVmZmVyLnJlYWRVSW50MTZCRShPRkZTRVQuTGVuZ3RoKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxJQUFBQSxVQUFBLEdBQUFDLE9BQUE7QUFFTyxNQUFNQyxhQUFhLEdBQUFDLE9BQUEsQ0FBQUQsYUFBQSxHQUFHLENBQUM7QUFFdkIsTUFBTUUsSUFBK0IsR0FBQUQsT0FBQSxDQUFBQyxJQUFBLEdBQUc7RUFDN0NDLFNBQVMsRUFBRSxJQUFJO0VBQ2ZDLFdBQVcsRUFBRSxJQUFJO0VBQ2pCQyxjQUFjLEVBQUUsSUFBSTtFQUNwQkMsU0FBUyxFQUFFLElBQUk7RUFDZkMsU0FBUyxFQUFFLElBQUk7RUFDZkMsbUJBQW1CLEVBQUUsSUFBSTtFQUN6QkMsTUFBTSxFQUFFLElBQUk7RUFDWkMsWUFBWSxFQUFFLElBQUk7RUFDbEJDLFFBQVEsRUFBRSxJQUFJO0VBQ2RDLGFBQWEsRUFBRTtBQUNqQixDQUFDO0FBRUQsTUFBTUMsV0FBc0MsR0FBRyxDQUFDLENBQUM7QUFFakQsS0FBSyxNQUFNQyxJQUFJLElBQUlaLElBQUksRUFBRTtFQUN2QlcsV0FBVyxDQUFDWCxJQUFJLENBQUNZLElBQUks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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/prelogin-payload.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _sprintfJs = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/sprintf-js@1.1.3/node_modules/sprintf-js/src/sprintf.js [app-route] (ecmascript)");
var _writableTrackingBuffer = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tracking-buffer/writable-tracking-buffer.js [app-route] (ecmascript)"));
var _crypto = __turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
const optionBufferSize = 20;
const traceIdSize = 36;
const TOKEN = {
    VERSION: 0x00,
    ENCRYPTION: 0x01,
    INSTOPT: 0x02,
    THREADID: 0x03,
    MARS: 0x04,
    TRACEID: 0x05,
    FEDAUTHREQUIRED: 0x06,
    TERMINATOR: 0xFF
};
const ENCRYPT = {
    OFF: 0x00,
    ON: 0x01,
    NOT_SUP: 0x02,
    REQ: 0x03
};
const encryptByValue = {};
for(const name in ENCRYPT){
    const value = ENCRYPT[name];
    encryptByValue[value] = name;
}
const MARS = {
    OFF: 0x00,
    ON: 0x01
};
const marsByValue = {};
for(const name in MARS){
    const value = MARS[name];
    marsByValue[value] = name;
}
/*
  s2.2.6.4
 */ class PreloginPayload {
    constructor(bufferOrOptions = {
        encrypt: false,
        version: {
            major: 0,
            minor: 0,
            build: 0,
            subbuild: 0
        }
    }){
        if (bufferOrOptions instanceof Buffer) {
            this.data = bufferOrOptions;
            this.options = {
                encrypt: false,
                version: {
                    major: 0,
                    minor: 0,
                    build: 0,
                    subbuild: 0
                }
            };
        } else {
            this.options = bufferOrOptions;
            this.createOptions();
        }
        this.extractOptions();
    }
    createOptions() {
        const options = [
            this.createVersionOption(),
            this.createEncryptionOption(),
            this.createInstanceOption(),
            this.createThreadIdOption(),
            this.createMarsOption(),
            this.createTraceIdOption(),
            this.createFedAuthOption()
        ];
        let length = 0;
        for(let i = 0, len = options.length; i < len; i++){
            const option = options[i];
            length += 5 + option.data.length;
        }
        length++; // terminator
        this.data = Buffer.alloc(length, 0);
        let optionOffset = 0;
        let optionDataOffset = 5 * options.length + 1;
        for(let j = 0, len = options.length; j < len; j++){
            const option = options[j];
            this.data.writeUInt8(option.token, optionOffset + 0);
            this.data.writeUInt16BE(optionDataOffset, optionOffset + 1);
            this.data.writeUInt16BE(option.data.length, optionOffset + 3);
            optionOffset += 5;
            option.data.copy(this.data, optionDataOffset);
            optionDataOffset += option.data.length;
        }
        this.data.writeUInt8(TOKEN.TERMINATOR, optionOffset);
    }
    createVersionOption() {
        const buffer = new _writableTrackingBuffer.default(optionBufferSize);
        buffer.writeUInt8(this.options.version.major);
        buffer.writeUInt8(this.options.version.minor);
        buffer.writeUInt16BE(this.options.version.build);
        buffer.writeUInt16BE(this.options.version.subbuild);
        return {
            token: TOKEN.VERSION,
            data: buffer.data
        };
    }
    createEncryptionOption() {
        const buffer = new _writableTrackingBuffer.default(optionBufferSize);
        if (this.options.encrypt) {
            buffer.writeUInt8(ENCRYPT.ON);
        } else {
            buffer.writeUInt8(ENCRYPT.NOT_SUP);
        }
        return {
            token: TOKEN.ENCRYPTION,
            data: buffer.data
        };
    }
    createInstanceOption() {
        const buffer = new _writableTrackingBuffer.default(optionBufferSize);
        buffer.writeUInt8(0x00);
        return {
            token: TOKEN.INSTOPT,
            data: buffer.data
        };
    }
    createThreadIdOption() {
        const buffer = new _writableTrackingBuffer.default(optionBufferSize);
        buffer.writeUInt32BE(0x00);
        return {
            token: TOKEN.THREADID,
            data: buffer.data
        };
    }
    createMarsOption() {
        const buffer = new _writableTrackingBuffer.default(optionBufferSize);
        buffer.writeUInt8(MARS.OFF);
        return {
            token: TOKEN.MARS,
            data: buffer.data
        };
    }
    createTraceIdOption() {
        const buffer = new _writableTrackingBuffer.default(traceIdSize);
        // Generate a random series of bytes to use as the TraceID.
        // Used for debugging purposes.
        buffer.writeBuffer((0, _crypto.randomBytes)(traceIdSize));
        return {
            token: TOKEN.TRACEID,
            data: buffer.data
        };
    }
    createFedAuthOption() {
        const buffer = new _writableTrackingBuffer.default(optionBufferSize);
        buffer.writeUInt8(0x01);
        return {
            token: TOKEN.FEDAUTHREQUIRED,
            data: buffer.data
        };
    }
    extractOptions() {
        let offset = 0;
        while(this.data[offset] !== TOKEN.TERMINATOR){
            let dataOffset = this.data.readUInt16BE(offset + 1);
            const dataLength = this.data.readUInt16BE(offset + 3);
            switch(this.data[offset]){
                case TOKEN.VERSION:
                    this.extractVersion(dataOffset);
                    break;
                case TOKEN.ENCRYPTION:
                    this.extractEncryption(dataOffset);
                    break;
                case TOKEN.INSTOPT:
                    this.extractInstance(dataOffset);
                    break;
                case TOKEN.THREADID:
                    if (dataLength > 0) {
                        this.extractThreadId(dataOffset);
                    }
                    break;
                case TOKEN.MARS:
                    this.extractMars(dataOffset);
                    break;
                case TOKEN.TRACEID:
                    this.extractTraceId(dataOffset);
                    break;
                case TOKEN.FEDAUTHREQUIRED:
                    this.extractFedAuth(dataOffset);
                    break;
            }
            offset += 5;
            dataOffset += dataLength;
        }
    }
    extractVersion(offset) {
        this.version = {
            major: this.data.readUInt8(offset + 0),
            minor: this.data.readUInt8(offset + 1),
            build: this.data.readUInt16BE(offset + 2),
            subbuild: this.data.readUInt16BE(offset + 4)
        };
    }
    extractEncryption(offset) {
        this.encryption = this.data.readUInt8(offset);
        this.encryptionString = encryptByValue[this.encryption];
    }
    extractInstance(offset) {
        this.instance = this.data.readUInt8(offset);
    }
    extractThreadId(offset) {
        this.threadId = this.data.readUInt32BE(offset);
    }
    extractMars(offset) {
        this.mars = this.data.readUInt8(offset);
        this.marsString = marsByValue[this.mars];
    }
    extractTraceId(offset) {
        this.traceId = this.data.subarray(offset, offset + traceIdSize);
    }
    extractFedAuth(offset) {
        this.fedAuthRequired = this.data.readUInt8(offset);
    }
    toString(indent = '') {
        return indent + 'PreLogin - ' + (0, _sprintfJs.sprintf)('version:%d.%d.%d.%d, encryption:0x%02X(%s), instopt:0x%02X, threadId:0x%08X, mars:0x%02X(%s), traceId:%s', this.version.major, this.version.minor, this.version.build, this.version.subbuild, this.encryption ? this.encryption : 0, this.encryptionString ? this.encryptionString : '', this.instance ? this.instance : 0, this.threadId ? this.threadId : 0, this.mars ? this.mars : 0, this.marsString ? this.marsString : '', this.traceId ? this.traceId.toString('hex') : '');
    }
}
var _default = exports.default = PreloginPayload;
module.exports = PreloginPayload; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfc3ByaW50ZkpzIiwicmVxdWlyZSIsIl93cml0YWJsZVRyYWNraW5nQnVmZmVyIiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsIl9jcnlwdG8iLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJvcHRpb25CdWZmZXJTaXplIiwidHJhY2VJZFNpemUiLCJUT0tFTiIsIlZFUlNJT04iLCJFTkNSWVBUSU9OIiwiSU5TVE9QVCIsIlRIUkVBRElEIiwiTUFSUyIsIlRSQUNFSUQiLCJGRURBVVRIUkVRVUlSRUQiLCJURVJNSU5BVE9SIiwiRU5DUllQVCIsIk9GRiIsIk9OIiwiTk9UX1NVUCIsIlJFUSIsImVuY3J5cHRCeVZhbHVlIiwibmFtZSIsInZhbHVlIiwibWFyc0J5VmFsdWUiLCJQcmVsb2dpblBheWxvYWQiLCJjb25zdHJ1Y3RvciIsImJ1ZmZlck9yT3B0aW9ucyIsImVuY3J5cHQiLCJ2ZXJzaW9uIiwibWFqb3IiLCJtaW5vciIsImJ1aWxkIiwic3ViYnVpbGQiLCJCdWZmZXIiLCJkYXRhIiwib3B0aW9ucyIsImNyZWF0ZU9wdGlvbnMiLCJleHRyYWN0T3B0aW9ucyIsImNyZWF0ZVZlcnNpb25PcHRpb24iLCJjcmVhdGVFbmNyeXB0aW9uT3B0aW9uIiwiY3JlYXRlSW5zdGFuY2VPcHRpb24iLCJjcmVhdGVUaHJlYWRJZE9wdGlvbiIsImNyZWF0ZU1hcnNPcHRpb24iLCJjcmVhdGVUcmFjZUlkT3B0aW9uIiwiY3JlYXRlRmVkQXV0aE9wdGlvbiIsImxlbmd0aCIsImkiLCJsZW4iLCJvcHRpb24iLCJhbGxvYyIsIm9wdGlvbk9mZnNldCIsIm9wdGlvbkRhdGFPZmZzZXQiLCJqIiwid3JpdGVVSW50OCIsInRva2VuIiwid3JpdGVVSW50MTZCRSIsImNvcHkiLCJidWZmZXIiLCJXcml0YWJsZVRyYWNraW5nQnVmZmVyIiwid3JpdGVVSW50MzJCRSIsIndyaXRlQnVmZmVyIiwicmFuZG9tQnl0ZXMiLCJvZmZzZXQiLCJkYXRhT2Zmc2V0IiwicmVhZFVJbnQxNkJFIiwiZGF0YUxlbmd0aCIsImV4dHJhY3RWZXJzaW9uIiwiZXh0cmFjdEVuY3J5cHRpb24iLCJleHRyYWN0SW5zdGFuY2UiLCJleHRyYWN0VGhyZWFkSWQiLCJleHRyYWN0TWFycyIsImV4dHJhY3RUcmFjZUlkIiwiZXh0cmFjdEZlZEF1dGgiLCJyZWFkVUludDgiLCJlbmNyeXB0aW9uIiwiZW5jcnlwdGlvblN0cmluZyIsImluc3RhbmNlIiwidGhyZWFkSWQiLCJyZWFkVUludDMyQkUiLCJtYXJzIiwibWFyc1N0cmluZyIsInRyYWNlSWQiLCJzdWJhcnJheSIsImZlZEF1dGhSZXF1aXJlZCIsInRvU3RyaW5nIiwiaW5kZW50Iiwic3ByaW50ZiIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsIm1vZHVsZSJdLCJzb3VyY2VzIjpbIi4uL3NyYy9wcmVsb2dpbi1wYXlsb2FkLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHNwcmludGYgfSBmcm9tICdzcHJpbnRmLWpzJztcblxuaW1wb3J0IFdyaXRhYmxlVHJhY2tpbmdCdWZmZXIgZnJvbSAnLi90cmFja2luZy1idWZmZXIvd3JpdGFibGUtdHJhY2tpbmctYnVmZmVyJztcbmltcG9ydCB7IHJhbmRvbUJ5dGVzIH0gZnJvbSAnY3J5cHRvJztcblxuY29uc3Qgb3B0aW9uQnVmZmVyU2l6ZSA9IDIwO1xuY29uc3QgdHJhY2VJZFNpemUgPSAzNjtcblxuY29uc3QgVE9LRU4gPSB7XG4gIFZFUlNJT046IDB4MDAsXG4gIEVOQ1JZUFRJT046IDB4MDEsXG4gIElOU1RPUFQ6IDB4MDIsXG4gIFRIUkVBRElEOiAweDAzLFxuICBNQVJTOiAweDA0LFxuICBUUkFDRUlEOiAweDA1LFxuICBGRURBVVRIUkVRVUlSRUQ6IDB4MDYsXG4gIFRFUk1JTkFUT1I6IDB4RkZcbn07XG5cbmNvbnN0IEVOQ1JZUFQ6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0gPSB7XG4gIE9GRjogMHgwMCxcbiAgT046IDB4MDEsXG4gIE5PVF9TVVA6IDB4MDIsXG4gIFJFUTogMHgwM1xufTtcblxuY29uc3QgZW5jcnlwdEJ5VmFsdWU6IHsgW2tleTogbnVtYmVyXTogc3RyaW5nIH0gPSB7fTtcblxuZm9yIChjb25zdCBuYW1lIGluIEVOQ1JZUFQpIHtcbiAgY29uc3QgdmFsdWUgPSBFTkNSWVBUW25hbWVdO1xuICBlbmNyeXB0QnlWYWx1ZVt2YWx1ZV0gPSBuYW1lO1xufVxuXG5jb25zdCBNQVJTOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge1xuICBPRkY6IDB4MDAsXG4gIE9OOiAweDAxXG59O1xuXG5jb25zdCBtYXJzQnlWYWx1ZTogeyBba2V5OiBudW1iZXJdOiBzdHJpbmcgfSA9IHt9O1xuXG5mb3IgKGNvbnN0IG5hbWUgaW4gTUFSUykge1xuICBjb25zdCB2YWx1ZSA9IE1BUlNbbmFtZV07XG4gIG1hcnNCeVZhbHVlW3ZhbHVlXSA9IG5hbWU7XG59XG5cbmludGVyZmFjZSBPcHRpb25zIHtcbiAgZW5jcnlwdDogYm9vbGVhbjtcbiAgdmVyc2lvbjoge1xuICAgIG1ham9yOiBudW1iZXI7XG4gICAgbWlub3I6IG51bWJlcjtcbiAgICBidWlsZDogbnVtYmVyO1xuICAgIHN1YmJ1aWxkOiBudW1iZXI7XG4gIH07XG59XG5cbi8qXG4gIHMyLjIuNi40XG4gKi9cbmNsYXNzIFByZWxvZ2luUGF5bG9hZCB7XG4gIGRlY2xhcmUgZGF0YTogQnVmZmVyO1xuICBkZWNsYXJlIG9wdGlvbnM6IE9wdGlvbnM7XG5cbiAgZGVjbGFyZSB2ZXJzaW9uOiB7XG4gICAgbWFqb3I6IG51bWJlcjtcbiAgICBtaW5vcjogbnVtYmVyO1xuICAgIGJ1aWxkOiBudW1iZXI7XG4gICAgc3ViYnVpbGQ6IG51bWJlcjtcbiAgfTtcblxuICBkZWNsYXJlIGVuY3J5cHRpb246IG51bWJlcjtcbiAgZGVjbGFyZSBlbmNyeXB0aW9uU3RyaW5nOiBzdHJpbmc7XG5cbiAgZGVjbGFyZSBpbnN0YW5jZTogbnVtYmVyO1xuXG4gIGRlY2xhcmUgdGhyZWFkSWQ6IG51bWJlcjtcblxuICBkZWNsYXJlIG1hcnM6IG51bWJlcjtcbiAgZGVjbGFyZSBtYXJzU3RyaW5nOiBzdHJpbmc7XG4gIGRlY2xhcmUgdHJhY2VJZDogQnVmZmVyO1xuICBkZWNsYXJlIGZlZEF1dGhSZXF1aXJlZDogbnVtYmVyO1xuXG4gIGNvbnN0cnVjdG9yKGJ1ZmZlck9yT3B0aW9uczogQnVmZmVyIHwgT3B0aW9ucyA9IHsgZW5jcnlwdDogZmFsc2UsIHZlcnNpb246IHsgbWFqb3I6IDAsIG1pbm9yOiAwLCBidWlsZDogMCwgc3ViYnVpbGQ6IDAgfSB9KSB7XG4gICAgaWYgKGJ1ZmZlck9yT3B0aW9ucyBpbnN0YW5jZW9mIEJ1ZmZlcikge1xuICAgICAgdGhpcy5kYXRhID0gYnVmZmVyT3JPcHRpb25zO1xuICAgICAgdGhpcy5vcHRpb25zID0geyBlbmNyeXB0OiBmYWxzZSwgdmVyc2lvbjogeyBtYWpvcjogMCwgbWlub3I6IDAsIGJ1aWxkOiAwLCBzdWJidWlsZDogMCB9IH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3B0aW9ucyA9IGJ1ZmZlck9yT3B0aW9ucyBhcyBPcHRpb25zO1xuICAgICAgdGhpcy5jcmVhdGVPcHRpb25zKCk7XG4gICAgfVxuICAgIHRoaXMuZXh0cmFjdE9wdGlvbnMoKTtcbiAgfVxuXG4gIGNyZWF0ZU9wdGlvbnMoKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IFtcbiAgICAgIHRoaXMuY3JlYXRlVmVyc2lvbk9wdGlvbigpLFxuICAgICAgdGhpcy5jcmVhdGVFbmNyeXB0aW9uT3B0aW9uKCksXG4gICAgICB0aGlzLmNyZWF0ZUluc3RhbmNlT3B0aW9uKCksXG4gICAgICB0aGlzLmNyZWF0ZVRocmVhZElkT3B0aW9uKCksXG4gICAgICB0aGlzLmNyZWF0ZU1hcnNPcHRpb24oKSxcbiAgICAgIHRoaXMuY3JlYXRlVHJhY2VJZE9wdGlvbigpLFxuICAgICAgdGhpcy5jcmVhdGVGZWRBdXRoT3B0aW9uKClcbiAgICBdO1xuXG4gICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IG9wdGlvbnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IG9wdGlvbnNbaV07XG4gICAgICBsZW5ndGggKz0gNSArIG9wdGlvbi5kYXRhLmxlbmd0aDtcbiAgICB9XG4gICAgbGVuZ3RoKys7IC8vIHRlcm1pbmF0b3JcbiAgICB0aGlzLmRhdGEgPSBCdWZmZXIuYWxsb2MobGVuZ3RoLCAwKTtcbiAgICBsZXQgb3B0aW9uT2Zmc2V0ID0gMDtcbiAgICBsZXQgb3B0aW9uRGF0YU9mZnNldCA9IDUgKiBvcHRpb25zLmxlbmd0aCArIDE7XG5cbiAgICBmb3IgKGxldCBqID0gMCwgbGVuID0gb3B0aW9ucy5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgY29uc3Qgb3B0aW9uID0gb3B0aW9uc1tqXTtcbiAgICAgIHRoaXMuZGF0YS53cml0ZVVJbnQ4KG9wdGlvbi50b2tlbiwgb3B0aW9uT2Zmc2V0ICsgMCk7XG4gICAgICB0aGlzLmRhdGEud3JpdGVVSW50MTZCRShvcHRpb25EYXRhT2Zmc2V0LCBvcHRpb25PZmZzZXQgKyAxKTtcbiAgICAgIHRoaXMuZGF0YS53cml0ZVVJbnQxNkJFKG9wdGlvbi5kYXRhLmxlbmd0aCwgb3B0aW9uT2Zmc2V0ICsgMyk7XG4gICAgICBvcHRpb25PZmZzZXQgKz0gNTtcbiAgICAgIG9wdGlvbi5kYXRhLmNvcHkodGhpcy5kYXRhLCBvcHRpb25EYXRhT2Zmc2V0KTtcbiAgICAgIG9wdGlvbkRhdGFPZmZzZXQgKz0gb3B0aW9uLmRhdGEubGVuZ3RoO1xuICAgIH1cblxuICAgIHRoaXMuZGF0YS53cml0ZVVJbnQ4KFRPS0VOLlRFUk1JTkFUT1IsIG9wdGlvbk9mZnNldCk7XG4gIH1cblxuICBjcmVhdGVWZXJzaW9uT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KHRoaXMub3B0aW9ucy52ZXJzaW9uLm1ham9yKTtcbiAgICBidWZmZXIud3JpdGVVSW50OCh0aGlzLm9wdGlvbnMudmVyc2lvbi5taW5vcik7XG4gICAgYnVmZmVyLndyaXRlVUludDE2QkUodGhpcy5vcHRpb25zLnZlcnNpb24uYnVpbGQpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQxNkJFKHRoaXMub3B0aW9ucy52ZXJzaW9uLnN1YmJ1aWxkKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW46IFRPS0VOLlZFUlNJT04sXG4gICAgICBkYXRhOiBidWZmZXIuZGF0YVxuICAgIH07XG4gIH1cblxuICBjcmVhdGVFbmNyeXB0aW9uT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZW5jcnlwdCkge1xuICAgICAgYnVmZmVyLndyaXRlVUludDgoRU5DUllQVC5PTik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1ZmZlci53cml0ZVVJbnQ4KEVOQ1JZUFQuTk9UX1NVUCk7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICB0b2tlbjogVE9LRU4uRU5DUllQVElPTixcbiAgICAgIGRhdGE6IGJ1ZmZlci5kYXRhXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZUluc3RhbmNlT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KDB4MDApO1xuICAgIHJldHVybiB7XG4gICAgICB0b2tlbjogVE9LRU4uSU5TVE9QVCxcbiAgICAgIGRhdGE6IGJ1ZmZlci5kYXRhXG4gICAgfTtcbiAgfVxuXG4gIGNyZWF0ZVRocmVhZElkT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQzMkJFKDB4MDApO1xuICAgIHJldHVybiB7XG4gICAgICB0b2tlbjogVE9LRU4uVEhSRUFESUQsXG4gICAgICBkYXRhOiBidWZmZXIuZGF0YVxuICAgIH07XG4gIH1cblxuICBjcmVhdGVNYXJzT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KE1BUlMuT0ZGKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW46IFRPS0VOLk1BUlMsXG4gICAgICBkYXRhOiBidWZmZXIuZGF0YVxuICAgIH07XG4gIH1cblxuICBjcmVhdGVUcmFjZUlkT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKHRyYWNlSWRTaXplKTtcbiAgICAvLyBHZW5lcmF0ZSBhIHJhbmRvbSBzZXJpZXMgb2YgYnl0ZXMgdG8gdXNlIGFzIHRoZSBUcmFjZUlELlxuICAgIC8vIFVzZWQgZm9yIGRlYnVnZ2luZyBwdXJwb3Nlcy5cbiAgICBidWZmZXIud3JpdGVCdWZmZXIocmFuZG9tQnl0ZXModHJhY2VJZFNpemUpKTtcbiAgICByZXR1cm4ge1xuICAgICAgdG9rZW46IFRPS0VOLlRSQUNFSUQsXG4gICAgICBkYXRhOiBidWZmZXIuZGF0YVxuICAgIH07XG4gIH1cblxuICBjcmVhdGVGZWRBdXRoT3B0aW9uKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKG9wdGlvbkJ1ZmZlclNpemUpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KDB4MDEpO1xuICAgIHJldHVybiB7XG4gICAgICB0b2tlbjogVE9LRU4uRkVEQVVUSFJFUVVJUkVELFxuICAgICAgZGF0YTogYnVmZmVyLmRhdGFcbiAgICB9O1xuICB9XG5cbiAgZXh0cmFjdE9wdGlvbnMoKSB7XG4gICAgbGV0IG9mZnNldCA9IDA7XG4gICAgd2hpbGUgKHRoaXMuZGF0YVtvZmZzZXRdICE9PSBUT0tFTi5URVJNSU5BVE9SKSB7XG4gICAgICBsZXQgZGF0YU9mZnNldCA9IHRoaXMuZGF0YS5yZWFkVUludDE2QkUob2Zmc2V0ICsgMSk7XG4gICAgICBjb25zdCBkYXRhTGVuZ3RoID0gdGhpcy5kYXRhLnJlYWRVSW50MTZCRShvZmZzZXQgKyAzKTtcbiAgICAgIHN3aXRjaCAodGhpcy5kYXRhW29mZnNldF0pIHtcbiAgICAgICAgY2FzZSBUT0tFTi5WRVJTSU9OOlxuICAgICAgICAgIHRoaXMuZXh0cmFjdFZlcnNpb24oZGF0YU9mZnNldCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVE9LRU4uRU5DUllQVElPTjpcbiAgICAgICAgICB0aGlzLmV4dHJhY3RFbmNyeXB0aW9uKGRhdGFPZmZzZXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFRPS0VOLklOU1RPUFQ6XG4gICAgICAgICAgdGhpcy5leHRyYWN0SW5zdGFuY2UoZGF0YU9mZnNldCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVE9LRU4uVEhSRUFESUQ6XG4gICAgICAgICAgaWYgKGRhdGFMZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLmV4dHJhY3RUaHJlYWRJZChkYXRhT2Zmc2V0KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgVE9LRU4uTUFSUzpcbiAgICAgICAgICB0aGlzLmV4dHJhY3RNYXJzKGRhdGFPZmZzZXQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFRPS0VOLlRSQUNFSUQ6XG4gICAgICAgICAgdGhpcy5leHRyYWN0VHJhY2VJZChkYXRhT2Zmc2V0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBUT0tFTi5GRURBVVRIUkVRVUlSRUQ6XG4gICAgICAgICAgdGhpcy5leHRyYWN0RmVkQXV0aChkYXRhT2Zmc2V0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIG9mZnNldCArPSA1O1xuICAgICAgZGF0YU9mZnNldCArPSBkYXRhTGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIGV4dHJhY3RWZXJzaW9uKG9mZnNldDogbnVtYmVyKSB7XG4gICAgdGhpcy52ZXJzaW9uID0ge1xuICAgICAgbWFqb3I6IHRoaXMuZGF0YS5yZWFkVUludDgob2Zmc2V0ICsgMCksXG4gICAgICBtaW5vcjogdGhpcy5kYXRhLnJlYWRVSW50OChvZmZzZXQgKyAxKSxcbiAgICAgIGJ1aWxkOiB0aGlzLmRhdGEucmVhZFVJbnQxNkJFKG9mZnNldCArIDIpLFxuICAgICAgc3ViYnVpbGQ6IHRoaXMuZGF0YS5yZWFkVUludDE2QkUob2Zmc2V0ICsgNClcbiAgICB9O1xuICB9XG5cbiAgZXh0cmFjdEVuY3J5cHRpb24ob2Zmc2V0OiBudW1iZXIpIHtcbiAgICB0aGlzLmVuY3J5cHRpb24gPSB0aGlzLmRhdGEucmVhZFVJbnQ4KG9mZnNldCk7XG4gICAgdGhpcy5lbmNyeXB0aW9uU3RyaW5nID0gZW5jcnlwdEJ5VmFsdWVbdGhpcy5lbmNyeXB0aW9uXTtcbiAgfVxuXG4gIGV4dHJhY3RJbnN0YW5jZShvZmZzZXQ6IG51bWJlcikge1xuICAgIHRoaXMuaW5zdGFuY2UgPSB0aGlzLmRhdGEucmVhZFVJbnQ4KG9mZnNldCk7XG4gIH1cblxuICBleHRyYWN0VGhyZWFkSWQob2Zmc2V0OiBudW1iZXIpIHtcbiAgICB0aGlzLnRocmVhZElkID0gdGhpcy5kYXRhLnJlYWRVSW50MzJCRShvZmZzZXQpO1xuICB9XG5cbiAgZXh0cmFjdE1hcnMob2Zmc2V0OiBudW1iZXIpIHtcbiAgICB0aGlzLm1hcnMgPSB0aGlzLmRhdGEucmVhZFVJbnQ4KG9mZnNldCk7XG4gICAgdGhpcy5tYXJzU3RyaW5nID0gbWFyc0J5VmFsdWVbdGhpcy5tYXJzXTtcbiAgfVxuXG4gIGV4dHJhY3RUcmFjZUlkKG9mZnNldDogbnVtYmVyKSB7XG4gICAgdGhpcy50cmFjZUlkID0gdGhpcy5kYXRhLnN1YmFycmF5KG9mZnNldCwgb2Zmc2V0ICsgdHJhY2VJZFNpemUpO1xuICB9XG5cbiAgZXh0cmFjdEZlZEF1dGgob2Zmc2V0OiBudW1iZXIpIHtcbiAgICB0aGlzLmZlZEF1dGhSZXF1aXJlZCA9IHRoaXMuZGF0YS5yZWFkVUludDgob2Zmc2V0KTtcbiAgfVxuXG4gIHRvU3RyaW5nKGluZGVudCA9ICcnKSB7XG4gICAgcmV0dXJuIGluZGVudCArICdQcmVMb2dpbiAtICcgKyBzcHJpbnRmKFxuICAgICAgJ3ZlcnNpb246JWQuJWQuJWQuJWQsIGVuY3J5cHRpb246MHglMDJYKCVzKSwgaW5zdG9wdDoweCUwMlgsIHRocmVhZElkOjB4JTA4WCwgbWFyczoweCUwMlgoJXMpLCB0cmFjZUlkOiVzJyxcbiAgICAgIHRoaXMudmVyc2lvbi5tYWpvciwgdGhpcy52ZXJzaW9uLm1pbm9yLCB0aGlzLnZlcnNpb24uYnVpbGQsIHRoaXMudmVyc2lvbi5zdWJidWlsZCxcbiAgICAgIHRoaXMuZW5jcnlwdGlvbiA/IHRoaXMuZW5jcnlwdGlvbiA6IDAsXG4gICAgICB0aGlzLmVuY3J5cHRpb25TdHJpbmcgPyB0aGlzLmVuY3J5cHRpb25TdHJpbmcgOiAnJyxcbiAgICAgIHRoaXMuaW5zdGFuY2UgPyB0aGlzLmluc3RhbmNlIDogMCxcbiAgICAgIHRoaXMudGhyZWFkSWQgPyB0aGlzLnRocmVhZElkIDogMCxcbiAgICAgIHRoaXMubWFycyA/IHRoaXMubWFycyA6IDAsXG4gICAgICB0aGlzLm1hcnNTdHJpbmcgPyB0aGlzLm1hcnNTdHJpbmcgOiAnJyxcbiAgICAgIHRoaXMudHJhY2VJZCA/IHRoaXMudHJhY2VJZC50b1N0cmluZygnaGV4JykgOiAnJyxcbiAgICApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFByZWxvZ2luUGF5bG9hZDtcbm1vZHVsZS5leHBvcnRzID0gUHJlbG9naW5QYXlsb2FkO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxVQUFBLEdBQUFDLE9BQUE7QUFFQSxJQUFBQyx1QkFBQSxHQUFBQyxzQkFBQSxDQUFBRixPQUFBO0FB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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tds-versions.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.versionsByValue = exports.versions = void 0;
const versions = exports.versions = {
    '7_1': 0x71000001,
    '7_2': 0x72090002,
    '7_3_A': 0x730A0003,
    '7_3_B': 0x730B0003,
    '7_4': 0x74000004,
    '8_0': 0x08000000
};
const versionsByValue = exports.versionsByValue = {};
for(const name in versions){
    versionsByValue[versions[name]] = name;
} //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJ2ZXJzaW9ucyIsImV4cG9ydHMiLCJ2ZXJzaW9uc0J5VmFsdWUiLCJuYW1lIl0sInNvdXJjZXMiOlsiLi4vc3JjL3Rkcy12ZXJzaW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgdmVyc2lvbnM6IHsgW2tleTogc3RyaW5nXTogbnVtYmVyIH0gPSB7XG4gICc3XzEnOiAweDcxMDAwMDAxLFxuICAnN18yJzogMHg3MjA5MDAwMixcbiAgJzdfM19BJzogMHg3MzBBMDAwMyxcbiAgJzdfM19CJzogMHg3MzBCMDAwMyxcbiAgJzdfNCc6IDB4NzQwMDAwMDQsXG4gICc4XzAnOiAweDA4MDAwMDAwXG59O1xuXG5leHBvcnQgY29uc3QgdmVyc2lvbnNCeVZhbHVlOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9ID0ge307XG5cbmZvciAoY29uc3QgbmFtZSBpbiB2ZXJzaW9ucykge1xuICB2ZXJzaW9uc0J5VmFsdWVbdmVyc2lvbnNbbmFtZV1dID0gbmFtZTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQU8sTUFBTUEsUUFBbUMsR0FBQUMsT0FBQSxDQUFBRCxRQUFBLEdBQUc7RUFDakQsS0FBSyxFQUFFLFVBQVU7RUFDakIsS0FBSyxFQUFFLFVBQVU7RUFDakIsT0FBTyxFQUFFLFVBQVU7RUFDbkIsT0FBTyxFQUFFLFVBQVU7RUFDbkIsS0FBSyxFQUFFLFVBQVU7RUFDakIsS0FBSyxFQUFFO0FBQ1QsQ0FBQztBQUVNLE1BQU1FLGVBQTBDLEdBQUFELE9BQUEsQ0FBQUMsZUFBQSxHQUFHLENBQUMsQ0FBQztBQUU1RCxLQUFLLE1BQU1DLElBQUksSUFBSUgsUUFBUSxFQUFFO0VBQzNCRSxlQUFlLENBQUNGLFFBQVEsQ0FBQ0csSUFBSSxDQUFDLENBQUMsR0FBR0EsSUFBSTtBQUN4QyIsImlnbm9yZUxpc3QiOltdfQ==
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/login7-payload.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _sprintfJs = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/sprintf-js@1.1.3/node_modules/sprintf-js/src/sprintf.js [app-route] (ecmascript)");
var _tdsVersions = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tds-versions.js [app-route] (ecmascript)");
const FLAGS_1 = {
    ENDIAN_LITTLE: 0x00,
    ENDIAN_BIG: 0x01,
    CHARSET_ASCII: 0x00,
    CHARSET_EBCDIC: 0x02,
    FLOAT_IEEE_754: 0x00,
    FLOAT_VAX: 0x04,
    FLOAT_ND5000: 0x08,
    BCP_DUMPLOAD_ON: 0x00,
    BCP_DUMPLOAD_OFF: 0x10,
    USE_DB_ON: 0x00,
    USE_DB_OFF: 0x20,
    INIT_DB_WARN: 0x00,
    INIT_DB_FATAL: 0x40,
    SET_LANG_WARN_OFF: 0x00,
    SET_LANG_WARN_ON: 0x80
};
const FLAGS_2 = {
    INIT_LANG_WARN: 0x00,
    INIT_LANG_FATAL: 0x01,
    ODBC_OFF: 0x00,
    ODBC_ON: 0x02,
    F_TRAN_BOUNDARY: 0x04,
    F_CACHE_CONNECT: 0x08,
    USER_NORMAL: 0x00,
    USER_SERVER: 0x10,
    USER_REMUSER: 0x20,
    USER_SQLREPL: 0x40,
    INTEGRATED_SECURITY_OFF: 0x00,
    INTEGRATED_SECURITY_ON: 0x80
};
const TYPE_FLAGS = {
    SQL_DFLT: 0x00,
    SQL_TSQL: 0x08,
    OLEDB_OFF: 0x00,
    OLEDB_ON: 0x10,
    READ_WRITE_INTENT: 0x00,
    READ_ONLY_INTENT: 0x20
};
const FLAGS_3 = {
    CHANGE_PASSWORD_NO: 0x00,
    CHANGE_PASSWORD_YES: 0x01,
    BINARY_XML: 0x02,
    SPAWN_USER_INSTANCE: 0x04,
    UNKNOWN_COLLATION_HANDLING: 0x08,
    EXTENSION_USED: 0x10
};
const FEDAUTH_OPTIONS = {
    FEATURE_ID: 0x02,
    LIBRARY_SECURITYTOKEN: 0x01,
    LIBRARY_ADAL: 0x02,
    FEDAUTH_YES_ECHO: 0x01,
    FEDAUTH_NO_ECHO: 0x00,
    ADAL_WORKFLOW_USER_PASS: 0x01,
    ADAL_WORKFLOW_INTEGRATED: 0x02
};
const FEATURE_EXT_TERMINATOR = 0xFF;
/*
  s2.2.6.3
 */ class Login7Payload {
    constructor({ tdsVersion, packetSize, clientProgVer, clientPid, connectionId, clientTimeZone, clientLcid }){
        this.tdsVersion = tdsVersion;
        this.packetSize = packetSize;
        this.clientProgVer = clientProgVer;
        this.clientPid = clientPid;
        this.connectionId = connectionId;
        this.clientTimeZone = clientTimeZone;
        this.clientLcid = clientLcid;
        this.readOnlyIntent = false;
        this.initDbFatal = false;
        this.fedAuth = undefined;
        this.userName = undefined;
        this.password = undefined;
        this.serverName = undefined;
        this.appName = undefined;
        this.hostname = undefined;
        this.libraryName = undefined;
        this.language = undefined;
        this.database = undefined;
        this.clientId = undefined;
        this.sspi = undefined;
        this.attachDbFile = undefined;
        this.changePassword = undefined;
    }
    toBuffer() {
        const fixedData = Buffer.alloc(94);
        const buffers = [
            fixedData
        ];
        let offset = 0;
        let dataOffset = fixedData.length;
        // Length: 4-byte
        offset = fixedData.writeUInt32LE(0, offset);
        // TDSVersion: 4-byte
        offset = fixedData.writeUInt32LE(this.tdsVersion, offset);
        // PacketSize: 4-byte
        offset = fixedData.writeUInt32LE(this.packetSize, offset);
        // ClientProgVer: 4-byte
        offset = fixedData.writeUInt32LE(this.clientProgVer, offset);
        // ClientPID: 4-byte
        offset = fixedData.writeUInt32LE(this.clientPid, offset);
        // ConnectionID: 4-byte
        offset = fixedData.writeUInt32LE(this.connectionId, offset);
        // OptionFlags1: 1-byte
        offset = fixedData.writeUInt8(this.buildOptionFlags1(), offset);
        // OptionFlags2: 1-byte
        offset = fixedData.writeUInt8(this.buildOptionFlags2(), offset);
        // TypeFlags: 1-byte
        offset = fixedData.writeUInt8(this.buildTypeFlags(), offset);
        // OptionFlags3: 1-byte
        offset = fixedData.writeUInt8(this.buildOptionFlags3(), offset);
        // ClientTimZone: 4-byte
        offset = fixedData.writeInt32LE(this.clientTimeZone, offset);
        // ClientLCID: 4-byte
        offset = fixedData.writeUInt32LE(this.clientLcid, offset);
        // ibHostName: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchHostName: 2-byte
        if (this.hostname) {
            const buffer = Buffer.from(this.hostname, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(buffer);
        } else {
            offset = fixedData.writeUInt16LE(dataOffset, offset);
        }
        // ibUserName: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchUserName: 2-byte
        if (this.userName) {
            const buffer = Buffer.from(this.userName, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(buffer);
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // ibPassword: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchPassword: 2-byte
        if (this.password) {
            const buffer = Buffer.from(this.password, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(this.scramblePassword(buffer));
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // ibAppName: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchAppName: 2-byte
        if (this.appName) {
            const buffer = Buffer.from(this.appName, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(buffer);
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // ibServerName: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchServerName: 2-byte
        if (this.serverName) {
            const buffer = Buffer.from(this.serverName, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(buffer);
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // (ibUnused / ibExtension): 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // (cchUnused / cbExtension): 2-byte
        if (this.tdsVersion >= _tdsVersions.versions['7_4']) {
            const extensions = this.buildFeatureExt();
            offset = fixedData.writeUInt16LE(4 + extensions.length, offset);
            const extensionOffset = Buffer.alloc(4);
            extensionOffset.writeUInt32LE(dataOffset + 4, 0);
            dataOffset += 4 + extensions.length;
            buffers.push(extensionOffset, extensions);
        } else {
            // For TDS < 7.4, these are unused fields
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // ibCltIntName: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchCltIntName: 2-byte
        if (this.libraryName) {
            const buffer = Buffer.from(this.libraryName, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(buffer);
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // ibLanguage: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchLanguage: 2-byte
        if (this.language) {
            const buffer = Buffer.from(this.language, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(buffer);
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // ibDatabase: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchDatabase: 2-byte
        if (this.database) {
            const buffer = Buffer.from(this.database, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(buffer);
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // ClientID: 6-byte
        if (this.clientId) {
            this.clientId.copy(fixedData, offset, 0, 6);
        }
        offset += 6;
        // ibSSPI: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cbSSPI: 2-byte
        if (this.sspi) {
            if (this.sspi.length > 65535) {
                offset = fixedData.writeUInt16LE(65535, offset);
            } else {
                offset = fixedData.writeUInt16LE(this.sspi.length, offset);
            }
            buffers.push(this.sspi);
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // ibAtchDBFile: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchAtchDBFile: 2-byte
        if (this.attachDbFile) {
            const buffer = Buffer.from(this.attachDbFile, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(buffer);
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // ibChangePassword: 2-byte
        offset = fixedData.writeUInt16LE(dataOffset, offset);
        // cchChangePassword: 2-byte
        if (this.changePassword) {
            const buffer = Buffer.from(this.changePassword, 'ucs2');
            offset = fixedData.writeUInt16LE(buffer.length / 2, offset);
            dataOffset += buffer.length;
            buffers.push(buffer);
        } else {
            offset = fixedData.writeUInt16LE(0, offset);
        }
        // cbSSPILong: 4-byte
        if (this.sspi && this.sspi.length > 65535) {
            fixedData.writeUInt32LE(this.sspi.length, offset);
        } else {
            fixedData.writeUInt32LE(0, offset);
        }
        const data = Buffer.concat(buffers);
        data.writeUInt32LE(data.length, 0);
        return data;
    }
    buildOptionFlags1() {
        let flags1 = FLAGS_1.ENDIAN_LITTLE | FLAGS_1.CHARSET_ASCII | FLAGS_1.FLOAT_IEEE_754 | FLAGS_1.BCP_DUMPLOAD_OFF | FLAGS_1.USE_DB_OFF | FLAGS_1.SET_LANG_WARN_ON;
        if (this.initDbFatal) {
            flags1 |= FLAGS_1.INIT_DB_FATAL;
        } else {
            flags1 |= FLAGS_1.INIT_DB_WARN;
        }
        return flags1;
    }
    buildFeatureExt() {
        const buffers = [];
        const fedAuth = this.fedAuth;
        if (fedAuth) {
            switch(fedAuth.type){
                case 'ADAL':
                    const buffer = Buffer.alloc(7);
                    buffer.writeUInt8(FEDAUTH_OPTIONS.FEATURE_ID, 0);
                    buffer.writeUInt32LE(2, 1);
                    buffer.writeUInt8(FEDAUTH_OPTIONS.LIBRARY_ADAL << 1 | (fedAuth.echo ? FEDAUTH_OPTIONS.FEDAUTH_YES_ECHO : FEDAUTH_OPTIONS.FEDAUTH_NO_ECHO), 5);
                    buffer.writeUInt8(fedAuth.workflow === 'integrated' ? 0x02 : FEDAUTH_OPTIONS.ADAL_WORKFLOW_USER_PASS, 6);
                    buffers.push(buffer);
                    break;
                case 'SECURITYTOKEN':
                    const token = Buffer.from(fedAuth.fedAuthToken, 'ucs2');
                    const buf = Buffer.alloc(10);
                    let offset = 0;
                    offset = buf.writeUInt8(FEDAUTH_OPTIONS.FEATURE_ID, offset);
                    offset = buf.writeUInt32LE(token.length + 4 + 1, offset);
                    offset = buf.writeUInt8(FEDAUTH_OPTIONS.LIBRARY_SECURITYTOKEN << 1 | (fedAuth.echo ? FEDAUTH_OPTIONS.FEDAUTH_YES_ECHO : FEDAUTH_OPTIONS.FEDAUTH_NO_ECHO), offset);
                    buf.writeInt32LE(token.length, offset);
                    buffers.push(buf);
                    buffers.push(token);
                    break;
            }
        }
        // Signal UTF-8 support: Value 0x0A, bit 0 must be set to 1. Added in TDS 7.4.
        const UTF8_SUPPORT_FEATURE_ID = 0x0a;
        const UTF8_SUPPORT_CLIENT_SUPPORTS_UTF8 = 0x01;
        const buf = Buffer.alloc(6);
        buf.writeUInt8(UTF8_SUPPORT_FEATURE_ID, 0);
        buf.writeUInt32LE(1, 1);
        buf.writeUInt8(UTF8_SUPPORT_CLIENT_SUPPORTS_UTF8, 5);
        buffers.push(buf);
        buffers.push(Buffer.from([
            FEATURE_EXT_TERMINATOR
        ]));
        return Buffer.concat(buffers);
    }
    buildOptionFlags2() {
        let flags2 = FLAGS_2.INIT_LANG_WARN | FLAGS_2.ODBC_OFF | FLAGS_2.USER_NORMAL;
        if (this.sspi) {
            flags2 |= FLAGS_2.INTEGRATED_SECURITY_ON;
        } else {
            flags2 |= FLAGS_2.INTEGRATED_SECURITY_OFF;
        }
        return flags2;
    }
    buildTypeFlags() {
        let typeFlags = TYPE_FLAGS.SQL_DFLT | TYPE_FLAGS.OLEDB_OFF;
        if (this.readOnlyIntent) {
            typeFlags |= TYPE_FLAGS.READ_ONLY_INTENT;
        } else {
            typeFlags |= TYPE_FLAGS.READ_WRITE_INTENT;
        }
        return typeFlags;
    }
    buildOptionFlags3() {
        return FLAGS_3.CHANGE_PASSWORD_NO | FLAGS_3.UNKNOWN_COLLATION_HANDLING | FLAGS_3.EXTENSION_USED;
    }
    scramblePassword(password) {
        for(let b = 0, len = password.length; b < len; b++){
            let byte = password[b];
            const lowNibble = byte & 0x0f;
            const highNibble = byte >> 4;
            byte = lowNibble << 4 | highNibble;
            byte = byte ^ 0xa5;
            password[b] = byte;
        }
        return password;
    }
    toString(indent = '') {
        return indent + 'Login7 - ' + (0, _sprintfJs.sprintf)('TDS:0x%08X, PacketSize:0x%08X, ClientProgVer:0x%08X, ClientPID:0x%08X, ConnectionID:0x%08X', this.tdsVersion, this.packetSize, this.clientProgVer, this.clientPid, this.connectionId) + '\n' + indent + '         ' + (0, _sprintfJs.sprintf)('Flags1:0x%02X, Flags2:0x%02X, TypeFlags:0x%02X, Flags3:0x%02X, ClientTimezone:%d, ClientLCID:0x%08X', this.buildOptionFlags1(), this.buildOptionFlags2(), this.buildTypeFlags(), this.buildOptionFlags3(), this.clientTimeZone, this.clientLcid) + '\n' + indent + '         ' + (0, _sprintfJs.sprintf)("Hostname:'%s', Username:'%s', Password:'%s', AppName:'%s', ServerName:'%s', LibraryName:'%s'", this.hostname, this.userName, this.password, this.appName, this.serverName, this.libraryName) + '\n' + indent + '         ' + (0, _sprintfJs.sprintf)("Language:'%s', Database:'%s', SSPI:'%s', AttachDbFile:'%s', ChangePassword:'%s'", this.language, this.database, this.sspi, this.attachDbFile, this.changePassword);
    }
}
var _default = exports.default = Login7Payload;
module.exports = Login7Payload; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfc3ByaW50ZkpzIiwicmVxdWlyZSIsIl90ZHNWZXJzaW9ucyIsIkZMQUdTXzEiLCJFTkRJQU5fTElUVExFIiwiRU5ESUFOX0JJRyIsIkNIQVJTRVRfQVNDSUkiLCJDSEFSU0VUX0VCQ0RJQyIsIkZMT0FUX0lFRUVfNzU0IiwiRkxPQVRfVkFYIiwiRkxPQVRfTkQ1MDAwIiwiQkNQX0RVTVBMT0FEX09OIiwiQkNQX0RVTVBMT0FEX09GRiIsIlVTRV9EQl9PTiIsIlVTRV9EQl9PRkYiLCJJTklUX0RCX1dBUk4iLCJJTklUX0RCX0ZBVEFMIiwiU0VUX0xBTkdfV0FSTl9PRkYiLCJTRVRfTEFOR19XQVJOX09OIiwiRkxBR1NfMiIsIklOSVRfTEFOR19XQVJOIiwiSU5JVF9MQU5HX0ZBVEFMIiwiT0RCQ19PRkYiLCJPREJDX09OIiwiRl9UUkFOX0JPVU5EQVJZIiwiRl9DQUNIRV9DT05ORUNUIiwiVVNFUl9OT1JNQUwiLCJVU0VSX1NFUlZFUiIsIlVTRVJfUkVNVVNFUiIsIlVTRVJfU1FMUkVQTCIsIklOVEVHUkFURURfU0VDVVJJVFlfT0ZGIiwiSU5URUdSQVRFRF9TRUNVUklUWV9PTiIsIlRZUEVfRkxBR1MiLCJTUUxfREZMVCIsIlNRTF9UU1FMIiwiT0xFREJfT0ZGIiwiT0xFREJfT04iLCJSRUFEX1dSSVRFX0lOVEVOVCIsIlJFQURfT05MWV9JTlRFTlQiLCJGTEFHU18zIiwiQ0hBTkdFX1BBU1NXT1JEX05PIiwiQ0hBTkdFX1BBU1NXT1JEX1lFUyIsIkJJTkFSWV9YTUwiLCJTUEFXTl9VU0VSX0lOU1RBTkNFIiwiVU5LTk9XTl9DT0xMQVRJT05fSEFORExJTkciLCJFWFRFTlNJT05fVVNFRCIsIkZFREFVVEhfT1BUSU9OUyIsIkZFQVRVUkVfSUQiLCJMSUJSQVJZX1NFQ1VSSVRZVE9LRU4iLCJMSUJSQVJZX0FEQUwiLCJGRURBVVRIX1lFU19FQ0hPIiwiRkVEQVVUSF9OT19FQ0hPIiwiQURBTF9XT1JLRkxPV19VU0VSX1BBU1MiLCJBREFMX1dPUktGTE9XX0lOVEVHUkFURUQiLCJGRUFUVVJFX0VYVF9URVJNSU5BVE9SIiwiTG9naW43UGF5bG9hZCIsImNvbnN0cnVjdG9yIiwidGRzVmVyc2lvbiIsInBhY2tldFNpemUiLCJjbGllbnRQcm9nVmVyIiwiY2xpZW50UGlkIiwiY29ubmVjdGlvbklkIiwiY2xpZW50VGltZVpvbmUiLCJjbGllbnRMY2lkIiwicmVhZE9ubHlJbnRlbnQiLCJpbml0RGJGYXRhbCIsImZlZEF1dGgiLCJ1bmRlZmluZWQiLCJ1c2VyTmFtZSIsInBhc3N3b3JkIiwic2VydmVyTmFtZSIsImFwcE5hbWUiLCJob3N0bmFtZSIsImxpYnJhcnlOYW1lIiwibGFuZ3VhZ2UiLCJkYXRhYmFzZSIsImNsaWVudElkIiwic3NwaSIsImF0dGFjaERiRmlsZSIsImNoYW5nZVBhc3N3b3JkIiwidG9CdWZmZXIiLCJmaXhlZERhdGEiLCJCdWZmZXIiLCJhbGxvYyIsImJ1ZmZlcnMiLCJvZmZzZXQiLCJkYXRhT2Zmc2V0IiwibGVuZ3RoIiwid3JpdGVVSW50MzJMRSIsIndyaXRlVUludDgiLCJidWlsZE9wdGlvbkZsYWdzMSIsImJ1aWxkT3B0aW9uRmxhZ3MyIiwiYnVpbGRUeXBlRmxhZ3MiLCJidWlsZE9wdGlvbkZsYWdzMyIsIndyaXRlSW50MzJMRSIsIndyaXRlVUludDE2TEUiLCJidWZmZXIiLCJmcm9tIiwicHVzaCIsInNjcmFtYmxlUGFzc3dvcmQiLCJ2ZXJzaW9ucyIsImV4dGVuc2lvbnMiLCJidWlsZEZlYXR1cmVFeHQiLCJleHRlbnNpb25PZmZzZXQiLCJjb3B5IiwiZGF0YSIsImNvbmNhdCIsImZsYWdzMSIsInR5cGUiLCJlY2hvIiwid29ya2Zsb3ciLCJ0b2tlbiIsImZlZEF1dGhUb2tlbiIsImJ1ZiIsIlVURjhfU1VQUE9SVF9GRUFUVVJFX0lEIiwiVVRGOF9TVVBQT1JUX0NMSUVOVF9TVVBQT1JUU19VVEY4IiwiZmxhZ3MyIiwidHlwZUZsYWdzIiwiYiIsImxlbiIsImJ5dGUiLCJsb3dOaWJibGUiLCJoaWdoTmliYmxlIiwidG9TdHJpbmciLCJpbmRlbnQiLCJzcHJpbnRmIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwiZGVmYXVsdCIsIm1vZHVsZSJdLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2dpbjctcGF5bG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzcHJpbnRmIH0gZnJvbSAnc3ByaW50Zi1qcyc7XG5pbXBvcnQgeyB2ZXJzaW9ucyB9IGZyb20gJy4vdGRzLXZlcnNpb25zJztcblxuY29uc3QgRkxBR1NfMSA9IHtcbiAgRU5ESUFOX0xJVFRMRTogMHgwMCxcbiAgRU5ESUFOX0JJRzogMHgwMSxcbiAgQ0hBUlNFVF9BU0NJSTogMHgwMCxcbiAgQ0hBUlNFVF9FQkNESUM6IDB4MDIsXG4gIEZMT0FUX0lFRUVfNzU0OiAweDAwLFxuICBGTE9BVF9WQVg6IDB4MDQsXG4gIEZMT0FUX05ENTAwMDogMHgwOCxcbiAgQkNQX0RVTVBMT0FEX09OOiAweDAwLFxuICBCQ1BfRFVNUExPQURfT0ZGOiAweDEwLFxuICBVU0VfREJfT046IDB4MDAsXG4gIFVTRV9EQl9PRkY6IDB4MjAsXG4gIElOSVRfREJfV0FSTjogMHgwMCxcbiAgSU5JVF9EQl9GQVRBTDogMHg0MCxcbiAgU0VUX0xBTkdfV0FSTl9PRkY6IDB4MDAsXG4gIFNFVF9MQU5HX1dBUk5fT046IDB4ODBcbn07XG5cbmNvbnN0IEZMQUdTXzIgPSB7XG4gIElOSVRfTEFOR19XQVJOOiAweDAwLFxuICBJTklUX0xBTkdfRkFUQUw6IDB4MDEsXG4gIE9EQkNfT0ZGOiAweDAwLFxuICBPREJDX09OOiAweDAyLFxuICBGX1RSQU5fQk9VTkRBUlk6IDB4MDQsXG4gIEZfQ0FDSEVfQ09OTkVDVDogMHgwOCxcbiAgVVNFUl9OT1JNQUw6IDB4MDAsXG4gIFVTRVJfU0VSVkVSOiAweDEwLFxuICBVU0VSX1JFTVVTRVI6IDB4MjAsXG4gIFVTRVJfU1FMUkVQTDogMHg0MCxcbiAgSU5URUdSQVRFRF9TRUNVUklUWV9PRkY6IDB4MDAsXG4gIElOVEVHUkFURURfU0VDVVJJVFlfT046IDB4ODBcbn07XG5cbmNvbnN0IFRZUEVfRkxBR1MgPSB7XG4gIFNRTF9ERkxUOiAweDAwLFxuICBTUUxfVFNRTDogMHgwOCxcbiAgT0xFREJfT0ZGOiAweDAwLFxuICBPTEVEQl9PTjogMHgxMCxcbiAgUkVBRF9XUklURV9JTlRFTlQ6IDB4MDAsXG4gIFJFQURfT05MWV9JTlRFTlQ6IDB4MjBcbn07XG5cbmNvbnN0IEZMQUdTXzMgPSB7XG4gIENIQU5HRV9QQVNTV09SRF9OTzogMHgwMCxcbiAgQ0hBTkdFX1BBU1NXT1JEX1lFUzogMHgwMSxcbiAgQklOQVJZX1hNTDogMHgwMixcbiAgU1BBV05fVVNFUl9JTlNUQU5DRTogMHgwNCxcbiAgVU5LTk9XTl9DT0xMQVRJT05fSEFORExJTkc6IDB4MDgsXG4gIEVYVEVOU0lPTl9VU0VEOiAweDEwXG59O1xuXG5jb25zdCBGRURBVVRIX09QVElPTlMgPSB7XG4gIEZFQVRVUkVfSUQ6IDB4MDIsXG4gIExJQlJBUllfU0VDVVJJVFlUT0tFTjogMHgwMSxcbiAgTElCUkFSWV9BREFMOiAweDAyLFxuICBGRURBVVRIX1lFU19FQ0hPOiAweDAxLFxuICBGRURBVVRIX05PX0VDSE86IDB4MDAsXG4gIEFEQUxfV09SS0ZMT1dfVVNFUl9QQVNTOiAweDAxLFxuICBBREFMX1dPUktGTE9XX0lOVEVHUkFURUQ6IDB4MDJcbn07XG5cbmNvbnN0IEZFQVRVUkVfRVhUX1RFUk1JTkFUT1IgPSAweEZGO1xuXG5pbnRlcmZhY2UgT3B0aW9ucyB7XG4gIHRkc1ZlcnNpb246IG51bWJlcjtcbiAgcGFja2V0U2l6ZTogbnVtYmVyO1xuICBjbGllbnRQcm9nVmVyOiBudW1iZXI7XG4gIGNsaWVudFBpZDogbnVtYmVyO1xuICBjb25uZWN0aW9uSWQ6IG51bWJlcjtcbiAgY2xpZW50VGltZVpvbmU6IG51bWJlcjtcbiAgY2xpZW50TGNpZDogbnVtYmVyO1xufVxuXG4vKlxuICBzMi4yLjYuM1xuICovXG5jbGFzcyBMb2dpbjdQYXlsb2FkIHtcbiAgZGVjbGFyZSB0ZHNWZXJzaW9uOiBudW1iZXI7XG4gIGRlY2xhcmUgcGFja2V0U2l6ZTogbnVtYmVyO1xuICBkZWNsYXJlIGNsaWVudFByb2dWZXI6IG51bWJlcjtcbiAgZGVjbGFyZSBjbGllbnRQaWQ6IG51bWJlcjtcbiAgZGVjbGFyZSBjb25uZWN0aW9uSWQ6IG51bWJlcjtcbiAgZGVjbGFyZSBjbGllbnRUaW1lWm9uZTogbnVtYmVyO1xuICBkZWNsYXJlIGNsaWVudExjaWQ6IG51bWJlcjtcblxuICBkZWNsYXJlIHJlYWRPbmx5SW50ZW50OiBib29sZWFuO1xuICBkZWNsYXJlIGluaXREYkZhdGFsOiBib29sZWFuO1xuXG4gIGRlY2xhcmUgdXNlck5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgZGVjbGFyZSBwYXNzd29yZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBkZWNsYXJlIHNlcnZlck5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgZGVjbGFyZSBhcHBOYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIGRlY2xhcmUgaG9zdG5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgZGVjbGFyZSBsaWJyYXJ5TmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBkZWNsYXJlIGxhbmd1YWdlOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIGRlY2xhcmUgZGF0YWJhc2U6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgZGVjbGFyZSBjbGllbnRJZDogQnVmZmVyIHwgdW5kZWZpbmVkO1xuICBkZWNsYXJlIHNzcGk6IEJ1ZmZlciB8IHVuZGVmaW5lZDtcbiAgZGVjbGFyZSBhdHRhY2hEYkZpbGU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgZGVjbGFyZSBjaGFuZ2VQYXNzd29yZDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIGRlY2xhcmUgZmVkQXV0aDogeyB0eXBlOiAnQURBTCcsIGVjaG86IGJvb2xlYW4sIHdvcmtmbG93OiAnZGVmYXVsdCcgfCAnaW50ZWdyYXRlZCcgfSB8IHsgdHlwZTogJ1NFQ1VSSVRZVE9LRU4nLCBlY2hvOiBib29sZWFuLCBmZWRBdXRoVG9rZW46IHN0cmluZyB9IHwgdW5kZWZpbmVkO1xuXG4gIGNvbnN0cnVjdG9yKHsgdGRzVmVyc2lvbiwgcGFja2V0U2l6ZSwgY2xpZW50UHJvZ1ZlciwgY2xpZW50UGlkLCBjb25uZWN0aW9uSWQsIGNsaWVudFRpbWVab25lLCBjbGllbnRMY2lkIH06IE9wdGlvbnMpIHtcbiAgICB0aGlzLnRkc1ZlcnNpb24gPSB0ZHNWZXJzaW9uO1xuICAgIHRoaXMucGFja2V0U2l6ZSA9IHBhY2tldFNpemU7XG4gICAgdGhpcy5jbGllbnRQcm9nVmVyID0gY2xpZW50UHJvZ1ZlcjtcbiAgICB0aGlzLmNsaWVudFBpZCA9IGNsaWVudFBpZDtcbiAgICB0aGlzLmNvbm5lY3Rpb25JZCA9IGNvbm5lY3Rpb25JZDtcbiAgICB0aGlzLmNsaWVudFRpbWVab25lID0gY2xpZW50VGltZVpvbmU7XG4gICAgdGhpcy5jbGllbnRMY2lkID0gY2xpZW50TGNpZDtcblxuICAgIHRoaXMucmVhZE9ubHlJbnRlbnQgPSBmYWxzZTtcbiAgICB0aGlzLmluaXREYkZhdGFsID0gZmFsc2U7XG5cbiAgICB0aGlzLmZlZEF1dGggPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnVzZXJOYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucGFzc3dvcmQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zZXJ2ZXJOYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuYXBwTmFtZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmhvc3RuYW1lID0gdW5kZWZpbmVkO1xuICAgIHRoaXMubGlicmFyeU5hbWUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5sYW5ndWFnZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmRhdGFiYXNlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY2xpZW50SWQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zc3BpID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuYXR0YWNoRGJGaWxlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY2hhbmdlUGFzc3dvcmQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICB0b0J1ZmZlcigpIHtcbiAgICBjb25zdCBmaXhlZERhdGEgPSBCdWZmZXIuYWxsb2MoOTQpO1xuICAgIGNvbnN0IGJ1ZmZlcnM6IEJ1ZmZlcltdID0gW2ZpeGVkRGF0YV07XG5cbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBsZXQgZGF0YU9mZnNldCA9IGZpeGVkRGF0YS5sZW5ndGg7XG5cbiAgICAvLyBMZW5ndGg6IDQtYnl0ZVxuICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQzMkxFKDAsIG9mZnNldCk7XG5cbiAgICAvLyBURFNWZXJzaW9uOiA0LWJ5dGVcbiAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MzJMRSh0aGlzLnRkc1ZlcnNpb24sIG9mZnNldCk7XG5cbiAgICAvLyBQYWNrZXRTaXplOiA0LWJ5dGVcbiAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MzJMRSh0aGlzLnBhY2tldFNpemUsIG9mZnNldCk7XG5cbiAgICAvLyBDbGllbnRQcm9nVmVyOiA0LWJ5dGVcbiAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MzJMRSh0aGlzLmNsaWVudFByb2dWZXIsIG9mZnNldCk7XG5cbiAgICAvLyBDbGllbnRQSUQ6IDQtYnl0ZVxuICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQzMkxFKHRoaXMuY2xpZW50UGlkLCBvZmZzZXQpO1xuXG4gICAgLy8gQ29ubmVjdGlvbklEOiA0LWJ5dGVcbiAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MzJMRSh0aGlzLmNvbm5lY3Rpb25JZCwgb2Zmc2V0KTtcblxuICAgIC8vIE9wdGlvbkZsYWdzMTogMS1ieXRlXG4gICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDgodGhpcy5idWlsZE9wdGlvbkZsYWdzMSgpLCBvZmZzZXQpO1xuXG4gICAgLy8gT3B0aW9uRmxhZ3MyOiAxLWJ5dGVcbiAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50OCh0aGlzLmJ1aWxkT3B0aW9uRmxhZ3MyKCksIG9mZnNldCk7XG5cbiAgICAvLyBUeXBlRmxhZ3M6IDEtYnl0ZVxuICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQ4KHRoaXMuYnVpbGRUeXBlRmxhZ3MoKSwgb2Zmc2V0KTtcblxuICAgIC8vIE9wdGlvbkZsYWdzMzogMS1ieXRlXG4gICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDgodGhpcy5idWlsZE9wdGlvbkZsYWdzMygpLCBvZmZzZXQpO1xuXG4gICAgLy8gQ2xpZW50VGltWm9uZTogNC1ieXRlXG4gICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlSW50MzJMRSh0aGlzLmNsaWVudFRpbWVab25lLCBvZmZzZXQpO1xuXG4gICAgLy8gQ2xpZW50TENJRDogNC1ieXRlXG4gICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDMyTEUodGhpcy5jbGllbnRMY2lkLCBvZmZzZXQpO1xuXG4gICAgLy8gaWJIb3N0TmFtZTogMi1ieXRlXG4gICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoZGF0YU9mZnNldCwgb2Zmc2V0KTtcblxuICAgIC8vIGNjaEhvc3ROYW1lOiAyLWJ5dGVcbiAgICBpZiAodGhpcy5ob3N0bmFtZSkge1xuICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20odGhpcy5ob3N0bmFtZSwgJ3VjczInKTtcblxuICAgICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoYnVmZmVyLmxlbmd0aCAvIDIsIG9mZnNldCk7XG4gICAgICBkYXRhT2Zmc2V0ICs9IGJ1ZmZlci5sZW5ndGg7XG5cbiAgICAgIGJ1ZmZlcnMucHVzaChidWZmZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRShkYXRhT2Zmc2V0LCBvZmZzZXQpO1xuICAgIH1cblxuICAgIC8vIGliVXNlck5hbWU6IDItYnl0ZVxuICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGRhdGFPZmZzZXQsIG9mZnNldCk7XG5cbiAgICAvLyBjY2hVc2VyTmFtZTogMi1ieXRlXG4gICAgaWYgKHRoaXMudXNlck5hbWUpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHRoaXMudXNlck5hbWUsICd1Y3MyJyk7XG5cbiAgICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGJ1ZmZlci5sZW5ndGggLyAyLCBvZmZzZXQpO1xuICAgICAgZGF0YU9mZnNldCArPSBidWZmZXIubGVuZ3RoO1xuXG4gICAgICBidWZmZXJzLnB1c2goYnVmZmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoMCwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvLyBpYlBhc3N3b3JkOiAyLWJ5dGVcbiAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRShkYXRhT2Zmc2V0LCBvZmZzZXQpO1xuXG4gICAgLy8gY2NoUGFzc3dvcmQ6IDItYnl0ZVxuICAgIGlmICh0aGlzLnBhc3N3b3JkKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbSh0aGlzLnBhc3N3b3JkLCAndWNzMicpO1xuXG4gICAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRShidWZmZXIubGVuZ3RoIC8gMiwgb2Zmc2V0KTtcbiAgICAgIGRhdGFPZmZzZXQgKz0gYnVmZmVyLmxlbmd0aDtcblxuICAgICAgYnVmZmVycy5wdXNoKHRoaXMuc2NyYW1ibGVQYXNzd29yZChidWZmZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoMCwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvLyBpYkFwcE5hbWU6IDItYnl0ZVxuICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGRhdGFPZmZzZXQsIG9mZnNldCk7XG5cbiAgICAvLyBjY2hBcHBOYW1lOiAyLWJ5dGVcbiAgICBpZiAodGhpcy5hcHBOYW1lKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbSh0aGlzLmFwcE5hbWUsICd1Y3MyJyk7XG5cbiAgICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGJ1ZmZlci5sZW5ndGggLyAyLCBvZmZzZXQpO1xuICAgICAgZGF0YU9mZnNldCArPSBidWZmZXIubGVuZ3RoO1xuXG4gICAgICBidWZmZXJzLnB1c2goYnVmZmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoMCwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvLyBpYlNlcnZlck5hbWU6IDItYnl0ZVxuICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGRhdGFPZmZzZXQsIG9mZnNldCk7XG5cbiAgICAvLyBjY2hTZXJ2ZXJOYW1lOiAyLWJ5dGVcbiAgICBpZiAodGhpcy5zZXJ2ZXJOYW1lKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbSh0aGlzLnNlcnZlck5hbWUsICd1Y3MyJyk7XG5cbiAgICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGJ1ZmZlci5sZW5ndGggLyAyLCBvZmZzZXQpO1xuICAgICAgZGF0YU9mZnNldCArPSBidWZmZXIubGVuZ3RoO1xuXG4gICAgICBidWZmZXJzLnB1c2goYnVmZmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoMCwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvLyAoaWJVbnVzZWQgLyBpYkV4dGVuc2lvbik6IDItYnl0ZVxuICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGRhdGFPZmZzZXQsIG9mZnNldCk7XG5cbiAgICAvLyAoY2NoVW51c2VkIC8gY2JFeHRlbnNpb24pOiAyLWJ5dGVcbiAgICBpZiAodGhpcy50ZHNWZXJzaW9uID49IHZlcnNpb25zWyc3XzQnXSkge1xuICAgICAgY29uc3QgZXh0ZW5zaW9ucyA9IHRoaXMuYnVpbGRGZWF0dXJlRXh0KCk7XG4gICAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRSg0ICsgZXh0ZW5zaW9ucy5sZW5ndGgsIG9mZnNldCk7XG4gICAgICBjb25zdCBleHRlbnNpb25PZmZzZXQgPSBCdWZmZXIuYWxsb2MoNCk7XG4gICAgICBleHRlbnNpb25PZmZzZXQud3JpdGVVSW50MzJMRShkYXRhT2Zmc2V0ICsgNCwgMCk7XG4gICAgICBkYXRhT2Zmc2V0ICs9IDQgKyBleHRlbnNpb25zLmxlbmd0aDtcbiAgICAgIGJ1ZmZlcnMucHVzaChleHRlbnNpb25PZmZzZXQsIGV4dGVuc2lvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGb3IgVERTIDwgNy40LCB0aGVzZSBhcmUgdW51c2VkIGZpZWxkc1xuICAgICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoMCwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvLyBpYkNsdEludE5hbWU6IDItYnl0ZVxuICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGRhdGFPZmZzZXQsIG9mZnNldCk7XG5cbiAgICAvLyBjY2hDbHRJbnROYW1lOiAyLWJ5dGVcbiAgICBpZiAodGhpcy5saWJyYXJ5TmFtZSkge1xuICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20odGhpcy5saWJyYXJ5TmFtZSwgJ3VjczInKTtcblxuICAgICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoYnVmZmVyLmxlbmd0aCAvIDIsIG9mZnNldCk7XG4gICAgICBkYXRhT2Zmc2V0ICs9IGJ1ZmZlci5sZW5ndGg7XG5cbiAgICAgIGJ1ZmZlcnMucHVzaChidWZmZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRSgwLCBvZmZzZXQpO1xuICAgIH1cblxuICAgIC8vIGliTGFuZ3VhZ2U6IDItYnl0ZVxuICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGRhdGFPZmZzZXQsIG9mZnNldCk7XG5cbiAgICAvLyBjY2hMYW5ndWFnZTogMi1ieXRlXG4gICAgaWYgKHRoaXMubGFuZ3VhZ2UpIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKHRoaXMubGFuZ3VhZ2UsICd1Y3MyJyk7XG5cbiAgICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGJ1ZmZlci5sZW5ndGggLyAyLCBvZmZzZXQpO1xuICAgICAgZGF0YU9mZnNldCArPSBidWZmZXIubGVuZ3RoO1xuXG4gICAgICBidWZmZXJzLnB1c2goYnVmZmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoMCwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvLyBpYkRhdGFiYXNlOiAyLWJ5dGVcbiAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRShkYXRhT2Zmc2V0LCBvZmZzZXQpO1xuXG4gICAgLy8gY2NoRGF0YWJhc2U6IDItYnl0ZVxuICAgIGlmICh0aGlzLmRhdGFiYXNlKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbSh0aGlzLmRhdGFiYXNlLCAndWNzMicpO1xuXG4gICAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRShidWZmZXIubGVuZ3RoIC8gMiwgb2Zmc2V0KTtcbiAgICAgIGRhdGFPZmZzZXQgKz0gYnVmZmVyLmxlbmd0aDtcblxuICAgICAgYnVmZmVycy5wdXNoKGJ1ZmZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKDAsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgLy8gQ2xpZW50SUQ6IDYtYnl0ZVxuICAgIGlmICh0aGlzLmNsaWVudElkKSB7XG4gICAgICB0aGlzLmNsaWVudElkLmNvcHkoZml4ZWREYXRhLCBvZmZzZXQsIDAsIDYpO1xuICAgIH1cbiAgICBvZmZzZXQgKz0gNjtcblxuICAgIC8vIGliU1NQSTogMi1ieXRlXG4gICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoZGF0YU9mZnNldCwgb2Zmc2V0KTtcblxuICAgIC8vIGNiU1NQSTogMi1ieXRlXG4gICAgaWYgKHRoaXMuc3NwaSkge1xuICAgICAgaWYgKHRoaXMuc3NwaS5sZW5ndGggPiA2NTUzNSkge1xuICAgICAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRSg2NTUzNSwgb2Zmc2V0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKHRoaXMuc3NwaS5sZW5ndGgsIG9mZnNldCk7XG4gICAgICB9XG5cbiAgICAgIGJ1ZmZlcnMucHVzaCh0aGlzLnNzcGkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRSgwLCBvZmZzZXQpO1xuICAgIH1cblxuICAgIC8vIGliQXRjaERCRmlsZTogMi1ieXRlXG4gICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoZGF0YU9mZnNldCwgb2Zmc2V0KTtcblxuICAgIC8vIGNjaEF0Y2hEQkZpbGU6IDItYnl0ZVxuICAgIGlmICh0aGlzLmF0dGFjaERiRmlsZSkge1xuICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20odGhpcy5hdHRhY2hEYkZpbGUsICd1Y3MyJyk7XG5cbiAgICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKGJ1ZmZlci5sZW5ndGggLyAyLCBvZmZzZXQpO1xuICAgICAgZGF0YU9mZnNldCArPSBidWZmZXIubGVuZ3RoO1xuXG4gICAgICBidWZmZXJzLnB1c2goYnVmZmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoMCwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICAvLyBpYkNoYW5nZVBhc3N3b3JkOiAyLWJ5dGVcbiAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRShkYXRhT2Zmc2V0LCBvZmZzZXQpO1xuXG4gICAgLy8gY2NoQ2hhbmdlUGFzc3dvcmQ6IDItYnl0ZVxuICAgIGlmICh0aGlzLmNoYW5nZVBhc3N3b3JkKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbSh0aGlzLmNoYW5nZVBhc3N3b3JkLCAndWNzMicpO1xuXG4gICAgICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRShidWZmZXIubGVuZ3RoIC8gMiwgb2Zmc2V0KTtcbiAgICAgIGRhdGFPZmZzZXQgKz0gYnVmZmVyLmxlbmd0aDtcblxuICAgICAgYnVmZmVycy5wdXNoKGJ1ZmZlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKDAsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgLy8gY2JTU1BJTG9uZzogNC1ieXRlXG4gICAgaWYgKHRoaXMuc3NwaSAmJiB0aGlzLnNzcGkubGVuZ3RoID4gNjU1MzUpIHtcbiAgICAgIGZpeGVkRGF0YS53cml0ZVVJbnQzMkxFKHRoaXMuc3NwaS5sZW5ndGgsIG9mZnNldCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpeGVkRGF0YS53cml0ZVVJbnQzMkxFKDAsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IEJ1ZmZlci5jb25jYXQoYnVmZmVycyk7XG4gICAgZGF0YS53cml0ZVVJbnQzMkxFKGRhdGEubGVuZ3RoLCAwKTtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuXG4gIGJ1aWxkT3B0aW9uRmxhZ3MxKCkge1xuICAgIGxldCBmbGFnczEgPSBGTEFHU18xLkVORElBTl9MSVRUTEUgfCBGTEFHU18xLkNIQVJTRVRfQVNDSUkgfCBGTEFHU18xLkZMT0FUX0lFRUVfNzU0IHwgRkxBR1NfMS5CQ1BfRFVNUExPQURfT0ZGIHwgRkxBR1NfMS5VU0VfREJfT0ZGIHwgRkxBR1NfMS5TRVRfTEFOR19XQVJOX09OO1xuICAgIGlmICh0aGlzLmluaXREYkZhdGFsKSB7XG4gICAgICBmbGFnczEgfD0gRkxBR1NfMS5JTklUX0RCX0ZBVEFMO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGFnczEgfD0gRkxBR1NfMS5JTklUX0RCX1dBUk47XG4gICAgfVxuICAgIHJldHVybiBmbGFnczE7XG4gIH1cblxuICBidWlsZEZlYXR1cmVFeHQoKSB7XG4gICAgY29uc3QgYnVmZmVycyA9IFtdO1xuXG4gICAgY29uc3QgZmVkQXV0aCA9IHRoaXMuZmVkQXV0aDtcbiAgICBpZiAoZmVkQXV0aCkge1xuICAgICAgc3dpdGNoIChmZWRBdXRoLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnQURBTCc6XG4gICAgICAgICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmFsbG9jKDcpO1xuICAgICAgICAgIGJ1ZmZlci53cml0ZVVJbnQ4KEZFREFVVEhfT1BUSU9OUy5GRUFUVVJFX0lELCAwKTtcbiAgICAgICAgICBidWZmZXIud3JpdGVVSW50MzJMRSgyLCAxKTtcbiAgICAgICAgICBidWZmZXIud3JpdGVVSW50OCgoRkVEQVVUSF9PUFRJT05TLkxJQlJBUllfQURBTCA8PCAxKSB8IChmZWRBdXRoLmVjaG8gPyBGRURBVVRIX09QVElPTlMuRkVEQVVUSF9ZRVNfRUNITyA6IEZFREFVVEhfT1BUSU9OUy5GRURBVVRIX05PX0VDSE8pLCA1KTtcbiAgICAgICAgICBidWZmZXIud3JpdGVVSW50OChmZWRBdXRoLndvcmtmbG93ID09PSAnaW50ZWdyYXRlZCcgPyAweDAyIDogRkVEQVVUSF9PUFRJT05TLkFEQUxfV09SS0ZMT1dfVVNFUl9QQVNTLCA2KTtcbiAgICAgICAgICBidWZmZXJzLnB1c2goYnVmZmVyKTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlICdTRUNVUklUWVRPS0VOJzpcbiAgICAgICAgICBjb25zdCB0b2tlbiA9IEJ1ZmZlci5mcm9tKGZlZEF1dGguZmVkQXV0aFRva2VuLCAndWNzMicpO1xuICAgICAgICAgIGNvbnN0IGJ1ZiA9IEJ1ZmZlci5hbGxvYygxMCk7XG5cbiAgICAgICAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICAgICAgICBvZmZzZXQgPSBidWYud3JpdGVVSW50OChGRURBVVRIX09QVElPTlMuRkVBVFVSRV9JRCwgb2Zmc2V0KTtcbiAgICAgICAgICBvZmZzZXQgPSBidWYud3JpdGVVSW50MzJMRSh0b2tlbi5sZW5ndGggKyA0ICsgMSwgb2Zmc2V0KTtcbiAgICAgICAgICBvZmZzZXQgPSBidWYud3JpdGVVSW50OCgoRkVEQVVUSF9PUFRJT05TLkxJQlJBUllfU0VDVVJJVFlUT0tFTiA8PCAxKSB8IChmZWRBdXRoLmVjaG8gPyBGRURBVVRIX09QVElPTlMuRkVEQVVUSF9ZRVNfRUNITyA6IEZFREFVVEhfT1BUSU9OUy5GRURBVVRIX05PX0VDSE8pLCBvZmZzZXQpO1xuICAgICAgICAgIGJ1Zi53cml0ZUludDMyTEUodG9rZW4ubGVuZ3RoLCBvZmZzZXQpO1xuXG4gICAgICAgICAgYnVmZmVycy5wdXNoKGJ1Zik7XG4gICAgICAgICAgYnVmZmVycy5wdXNoKHRva2VuKTtcblxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFNpZ25hbCBVVEYtOCBzdXBwb3J0OiBWYWx1ZSAweDBBLCBiaXQgMCBtdXN0IGJlIHNldCB0byAxLiBBZGRlZCBpbiBURFMgNy40LlxuICAgIGNvbnN0IFVURjhfU1VQUE9SVF9GRUFUVVJFX0lEID0gMHgwYTtcbiAgICBjb25zdCBVVEY4X1NVUFBPUlRfQ0xJRU5UX1NVUFBPUlRTX1VURjggPSAweDAxO1xuICAgIGNvbnN0IGJ1ZiA9IEJ1ZmZlci5hbGxvYyg2KTtcbiAgICBidWYud3JpdGVVSW50OChVVEY4X1NVUFBPUlRfRkVBVFVSRV9JRCwgMCk7XG4gICAgYnVmLndyaXRlVUludDMyTEUoMSwgMSk7XG4gICAgYnVmLndyaXRlVUludDgoVVRGOF9TVVBQT1JUX0NMSUVOVF9TVVBQT1JUU19VVEY4LCA1KTtcbiAgICBidWZmZXJzLnB1c2goYnVmKTtcblxuICAgIGJ1ZmZlcnMucHVzaChCdWZmZXIuZnJvbShbRkVBVFVSRV9FWFRfVEVSTUlOQVRPUl0pKTtcblxuICAgIHJldHVybiBCdWZmZXIuY29uY2F0KGJ1ZmZlcnMpO1xuICB9XG5cbiAgYnVpbGRPcHRpb25GbGFnczIoKSB7XG4gICAgbGV0IGZsYWdzMiA9IEZMQUdTXzIuSU5JVF9MQU5HX1dBUk4gfCBGTEFHU18yLk9EQkNfT0ZGIHwgRkxBR1NfMi5VU0VSX05PUk1BTDtcbiAgICBpZiAodGhpcy5zc3BpKSB7XG4gICAgICBmbGFnczIgfD0gRkxBR1NfMi5JTlRFR1JBVEVEX1NFQ1VSSVRZX09OO1xuICAgIH0gZWxzZSB7XG4gICAgICBmbGFnczIgfD0gRkxBR1NfMi5JTlRFR1JBVEVEX1NFQ1VSSVRZX09GRjtcbiAgICB9XG4gICAgcmV0dXJuIGZsYWdzMjtcbiAgfVxuXG4gIGJ1aWxkVHlwZUZsYWdzKCkge1xuICAgIGxldCB0eXBlRmxhZ3MgPSBUWVBFX0ZMQUdTLlNRTF9ERkxUIHwgVFlQRV9GTEFHUy5PTEVEQl9PRkY7XG4gICAgaWYgKHRoaXMucmVhZE9ubHlJbnRlbnQpIHtcbiAgICAgIHR5cGVGbGFncyB8PSBUWVBFX0ZMQUdTLlJFQURfT05MWV9JTlRFTlQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHR5cGVGbGFncyB8PSBUWVBFX0ZMQUdTLlJFQURfV1JJVEVfSU5URU5UO1xuICAgIH1cbiAgICByZXR1cm4gdHlwZUZsYWdzO1xuICB9XG5cbiAgYnVpbGRPcHRpb25GbGFnczMoKSB7XG4gICAgcmV0dXJuIEZMQUdTXzMuQ0hBTkdFX1BBU1NXT1JEX05PIHwgRkxBR1NfMy5VTktOT1dOX0NPTExBVElPTl9IQU5ETElORyB8IEZMQUdTXzMuRVhURU5TSU9OX1VTRUQ7XG4gIH1cblxuICBzY3JhbWJsZVBhc3N3b3JkKHBhc3N3b3JkOiBCdWZmZXIpIHtcbiAgICBmb3IgKGxldCBiID0gMCwgbGVuID0gcGFzc3dvcmQubGVuZ3RoOyBiIDwgbGVuOyBiKyspIHtcbiAgICAgIGxldCBieXRlID0gcGFzc3dvcmRbYl07XG4gICAgICBjb25zdCBsb3dOaWJibGUgPSBieXRlICYgMHgwZjtcbiAgICAgIGNvbnN0IGhpZ2hOaWJibGUgPSBieXRlID4+IDQ7XG4gICAgICBieXRlID0gKGxvd05pYmJsZSA8PCA0KSB8IGhpZ2hOaWJibGU7XG4gICAgICBieXRlID0gYnl0ZSBeIDB4YTU7XG4gICAgICBwYXNzd29yZFtiXSA9IGJ5dGU7XG4gICAgfVxuICAgIHJldHVybiBwYXNzd29yZDtcbiAgfVxuXG4gIHRvU3RyaW5nKGluZGVudCA9ICcnKSB7XG4gICAgcmV0dXJuIGluZGVudCArICdMb2dpbjcgLSAnICtcbiAgICAgIHNwcmludGYoJ1REUzoweCUwOFgsIFBhY2tldFNpemU6MHglMDhYLCBDbGllbnRQcm9nVmVyOjB4JTA4WCwgQ2xpZW50UElEOjB4JTA4WCwgQ29ubmVjdGlvbklEOjB4JTA4WCcsXG4gICAgICAgICAgICAgIHRoaXMudGRzVmVyc2lvbiwgdGhpcy5wYWNrZXRTaXplLCB0aGlzLmNsaWVudFByb2dWZXIsIHRoaXMuY2xpZW50UGlkLCB0aGlzLmNvbm5lY3Rpb25JZFxuICAgICAgKSArICdcXG4nICsgaW5kZW50ICsgJyAgICAgICAgICcgK1xuICAgICAgc3ByaW50ZignRmxhZ3MxOjB4JTAyWCwgRmxhZ3MyOjB4JTAyWCwgVHlwZUZsYWdzOjB4JTAyWCwgRmxhZ3MzOjB4JTAyWCwgQ2xpZW50VGltZXpvbmU6JWQsIENsaWVudExDSUQ6MHglMDhYJyxcbiAgICAgICAgICAgICAgdGhpcy5idWlsZE9wdGlvbkZsYWdzMSgpLCB0aGlzLmJ1aWxkT3B0aW9uRmxhZ3MyKCksIHRoaXMuYnVpbGRUeXBlRmxhZ3MoKSwgdGhpcy5idWlsZE9wdGlvbkZsYWdzMygpLCB0aGlzLmNsaWVudFRpbWVab25lLCB0aGlzLmNsaWVudExjaWRcbiAgICAgICkgKyAnXFxuJyArIGluZGVudCArICcgICAgICAgICAnICtcbiAgICAgIHNwcmludGYoXCJIb3N0bmFtZTonJXMnLCBVc2VybmFtZTonJXMnLCBQYXNzd29yZDonJXMnLCBBcHBOYW1lOiclcycsIFNlcnZlck5hbWU6JyVzJywgTGlicmFyeU5hbWU6JyVzJ1wiLFxuICAgICAgICAgICAgICB0aGlzLmhvc3RuYW1lLCB0aGlzLnVzZXJOYW1lLCB0aGlzLnBhc3N3b3JkLCB0aGlzLmFwcE5hbWUsIHRoaXMuc2VydmVyTmFtZSwgdGhpcy5saWJyYXJ5TmFtZVxuICAgICAgKSArICdcXG4nICsgaW5kZW50ICsgJyAgICAgICAgICcgK1xuICAgICAgc3ByaW50ZihcIkxhbmd1YWdlOiclcycsIERhdGFiYXNlOiclcycsIFNTUEk6JyVzJywgQXR0YWNoRGJGaWxlOiclcycsIENoYW5nZVBhc3N3b3JkOiclcydcIixcbiAgICAgICAgICAgICAgdGhpcy5sYW5ndWFnZSwgdGhpcy5kYXRhYmFzZSwgdGhpcy5zc3BpLCB0aGlzLmF0dGFjaERiRmlsZSwgdGhpcy5jaGFuZ2VQYXNzd29yZFxuICAgICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBMb2dpbjdQYXlsb2FkO1xubW9kdWxlLmV4cG9ydHMgPSBMb2dpbjdQYXlsb2FkO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxVQUFBLEdBQUFDLE9BQUE7QUFDQSxJQUFBQyxZQUFBLEdBQUFELE9BQUE7QUFFQSxNQUFNRSxPQUFPLEdBQUc7RUFDZEMsYUFBYSxFQUFFLElBQUk7RUFDbkJDLFVBQVUsRUFBRSxJQUFJO0VBQ2hCQyxhQUFhLEVBQUUsSUFBSTtFQUNuQkMsY0FBYyxFQUFFLElBQUk7RUFDcEJDLGNBQWMsRUFBRSxJQUFJO0VBQ3BCQyxTQUFTLEVBQUUsSUFBSTtFQUNmQyxZQUFZLEVBQUUsSUFBSTtFQUNsQkMsZUFBZSxFQUFFLElBQUk7RUFDckJDLGdCQUFnQixFQUFFLElBQUk7RUFDdEJDLFNBQVMsRUFBRSxJQUFJO0VBQ2ZDLFVBQVUsRUFBRSxJQUFJO0VBQ2hCQyxZQUFZLEVBQUUsSUFBSTtFQUNsQkMsYUFBYSxFQUFFLElB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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/ntlm-payload.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _writableTrackingBuffer = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tracking-buffer/writable-tracking-buffer.js [app-route] (ecmascript)"));
var crypto = _interopRequireWildcard(__turbopack_context__.r("[externals]/crypto [external] (crypto, cjs)"));
var _jsMd = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/js-md4@0.3.2/node_modules/js-md4/src/md4.js [app-route] (ecmascript)"));
function _interopRequireWildcard(e, t) {
    if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap();
    return (_interopRequireWildcard = function(e, t) {
        if (!t && e && e.__esModule) return e;
        var o, i, f = {
            __proto__: null,
            default: e
        };
        if (null === e || "object" != typeof e && "function" != typeof e) return f;
        if (o = t ? n : r) {
            if (o.has(e)) return o.get(e);
            o.set(e, f);
        }
        for(const t in e)"default" !== t && ({}).hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);
        return f;
    })(e, t);
}
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
class NTLMResponsePayload {
    constructor(loginData){
        this.data = this.createResponse(loginData);
    }
    toString(indent = '') {
        return indent + 'NTLM Auth';
    }
    createResponse(challenge) {
        const client_nonce = this.createClientNonce();
        const lmv2len = 24;
        const ntlmv2len = 16;
        const domain = challenge.domain;
        const username = challenge.userName;
        const password = challenge.password;
        const ntlmData = challenge.ntlmpacket;
        const server_data = ntlmData.target;
        const server_nonce = ntlmData.nonce;
        const bufferLength = 64 + domain.length * 2 + username.length * 2 + lmv2len + ntlmv2len + 8 + 8 + 8 + 4 + server_data.length + 4;
        const data = new _writableTrackingBuffer.default(bufferLength);
        data.position = 0;
        data.writeString('NTLMSSP\u0000', 'utf8');
        data.writeUInt32LE(0x03);
        const baseIdx = 64;
        const dnIdx = baseIdx;
        const unIdx = dnIdx + domain.length * 2;
        const l2Idx = unIdx + username.length * 2;
        const ntIdx = l2Idx + lmv2len;
        data.writeUInt16LE(lmv2len);
        data.writeUInt16LE(lmv2len);
        data.writeUInt32LE(l2Idx);
        data.writeUInt16LE(ntlmv2len);
        data.writeUInt16LE(ntlmv2len);
        data.writeUInt32LE(ntIdx);
        data.writeUInt16LE(domain.length * 2);
        data.writeUInt16LE(domain.length * 2);
        data.writeUInt32LE(dnIdx);
        data.writeUInt16LE(username.length * 2);
        data.writeUInt16LE(username.length * 2);
        data.writeUInt32LE(unIdx);
        data.writeUInt16LE(0);
        data.writeUInt16LE(0);
        data.writeUInt32LE(baseIdx);
        data.writeUInt16LE(0);
        data.writeUInt16LE(0);
        data.writeUInt32LE(baseIdx);
        data.writeUInt16LE(0x8201);
        data.writeUInt16LE(0x08);
        data.writeString(domain, 'ucs2');
        data.writeString(username, 'ucs2');
        const lmv2Data = this.lmv2Response(domain, username, password, server_nonce, client_nonce);
        data.copyFrom(lmv2Data);
        const genTime = new Date().getTime();
        const ntlmDataBuffer = this.ntlmv2Response(domain, username, password, server_nonce, server_data, client_nonce, genTime);
        data.copyFrom(ntlmDataBuffer);
        data.writeUInt32LE(0x0101);
        data.writeUInt32LE(0x0000);
        const timestamp = this.createTimestamp(genTime);
        data.copyFrom(timestamp);
        data.copyFrom(client_nonce);
        data.writeUInt32LE(0x0000);
        data.copyFrom(server_data);
        data.writeUInt32LE(0x0000);
        return data.data;
    }
    createClientNonce() {
        const client_nonce = Buffer.alloc(8, 0);
        let nidx = 0;
        while(nidx < 8){
            client_nonce.writeUInt8(Math.ceil(Math.random() * 255), nidx);
            nidx++;
        }
        return client_nonce;
    }
    ntlmv2Response(domain, user, password, serverNonce, targetInfo, clientNonce, mytime) {
        const timestamp = this.createTimestamp(mytime);
        const hash = this.ntv2Hash(domain, user, password);
        const dataLength = 40 + targetInfo.length;
        const data = Buffer.alloc(dataLength, 0);
        serverNonce.copy(data, 0, 0, 8);
        data.writeUInt32LE(0x101, 8);
        data.writeUInt32LE(0x0, 12);
        timestamp.copy(data, 16, 0, 8);
        clientNonce.copy(data, 24, 0, 8);
        data.writeUInt32LE(0x0, 32);
        targetInfo.copy(data, 36, 0, targetInfo.length);
        data.writeUInt32LE(0x0, 36 + targetInfo.length);
        return this.hmacMD5(data, hash);
    }
    createTimestamp(time) {
        const tenthsOfAMicrosecond = (BigInt(time) + BigInt(11644473600)) * BigInt(10000000);
        const lo = Number(tenthsOfAMicrosecond & BigInt(0xffffffff));
        const hi = Number(tenthsOfAMicrosecond >> BigInt(32) & BigInt(0xffffffff));
        const result = Buffer.alloc(8);
        result.writeUInt32LE(lo, 0);
        result.writeUInt32LE(hi, 4);
        return result;
    }
    lmv2Response(domain, user, password, serverNonce, clientNonce) {
        const hash = this.ntv2Hash(domain, user, password);
        const data = Buffer.alloc(serverNonce.length + clientNonce.length, 0);
        serverNonce.copy(data);
        clientNonce.copy(data, serverNonce.length, 0, clientNonce.length);
        const newhash = this.hmacMD5(data, hash);
        const response = Buffer.alloc(newhash.length + clientNonce.length, 0);
        newhash.copy(response);
        clientNonce.copy(response, newhash.length, 0, clientNonce.length);
        return response;
    }
    ntv2Hash(domain, user, password) {
        const hash = this.ntHash(password);
        const identity = Buffer.from(user.toUpperCase() + domain.toUpperCase(), 'ucs2');
        return this.hmacMD5(identity, hash);
    }
    ntHash(text) {
        const unicodeString = Buffer.from(text, 'ucs2');
        return Buffer.from(_jsMd.default.arrayBuffer(unicodeString));
    }
    hmacMD5(data, key) {
        return crypto.createHmac('MD5', key).update(data).digest();
    }
}
var _default = exports.default = NTLMResponsePayload;
module.exports = NTLMResponsePayload; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfd3JpdGFibGVUcmFja2luZ0J1ZmZlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiY3J5cHRvIiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfanNNZCIsImUiLCJ0IiwiV2Vha01hcCIsInIiLCJuIiwiX19lc01vZHVsZSIsIm8iLCJpIiwiZiIsIl9fcHJvdG9fXyIsImRlZmF1bHQiLCJoYXMiLCJnZXQiLCJzZXQiLCJoYXNPd25Qcm9wZXJ0eSIsImNhbGwiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsIk5UTE1SZXNwb25zZVBheWxvYWQiLCJjb25zdHJ1Y3RvciIsImxvZ2luRGF0YSIsImRhdGEiLCJjcmVhdGVSZXNwb25zZSIsInRvU3RyaW5nIiwiaW5kZW50IiwiY2hhbGxlbmdlIiwiY2xpZW50X25vbmNlIiwiY3JlYXRlQ2xpZW50Tm9uY2UiLCJsbXYybGVuIiwibnRsbXYybGVuIiwiZG9tYWluIiwidXNlcm5hbWUiLCJ1c2VyTmFtZSIsInBhc3N3b3JkIiwibnRsbURhdGEiLCJudGxtcGFja2V0Iiwic2VydmVyX2RhdGEiLCJ0YXJnZXQiLCJzZXJ2ZXJfbm9uY2UiLCJub25jZSIsImJ1ZmZlckxlbmd0aCIsImxlbmd0aCIsIldyaXRhYmxlVHJhY2tpbmdCdWZmZXIiLCJwb3NpdGlvbiIsIndyaXRlU3RyaW5nIiwid3JpdGVVSW50MzJMRSIsImJhc2VJZHgiLCJkbklkeCIsInVuSWR4IiwibDJJZHgiLCJudElkeCIsIndyaXRlVUludDE2TEUiLCJsbXYyRGF0YSIsImxtdjJSZXNwb25zZSIsImNvcHlGcm9tIiwiZ2VuVGltZSIsIkRhdGUiLCJnZXRUaW1lIiwibnRsbURhdGFCdWZmZXIiLCJudGxtdjJSZXNwb25zZSIsInRpbWVzdGFtcCIsImNyZWF0ZVRpbWVzdGFtcCIsIkJ1ZmZlciIsImFsbG9jIiwibmlkeCIsIndyaXRlVUludDgiLCJNYXRoIiwiY2VpbCIsInJhbmRvbSIsInVzZXIiLCJzZXJ2ZXJOb25jZSIsInRhcmdldEluZm8iLCJjbGllbnROb25jZSIsIm15dGltZSIsImhhc2giLCJudHYySGFzaCIsImRhdGFMZW5ndGgiLCJjb3B5IiwiaG1hY01ENSIsInRpbWUiLCJ0ZW50aHNPZkFNaWNyb3NlY29uZCIsIkJpZ0ludCIsImxvIiwiTnVtYmVyIiwiaGkiLCJyZXN1bHQiLCJuZXdoYXNoIiwicmVzcG9uc2UiLCJudEhhc2giLCJpZGVudGl0eSIsImZyb20iLCJ0b1VwcGVyQ2FzZSIsInRleHQiLCJ1bmljb2RlU3RyaW5nIiwibWQ0IiwiYXJyYXlCdWZmZXIiLCJrZXkiLCJjcmVhdGVIbWFjIiwidXBkYXRlIiwiZGlnZXN0IiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIl0sInNvdXJjZXMiOlsiLi4vc3JjL250bG0tcGF5bG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgV3JpdGFibGVUcmFja2luZ0J1ZmZlciBmcm9tICcuL3RyYWNraW5nLWJ1ZmZlci93cml0YWJsZS10cmFja2luZy1idWZmZXInO1xuaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgbWQ0IGZyb20gJ2pzLW1kNCc7XG5cbmludGVyZmFjZSBPcHRpb25zIHtcbiAgZG9tYWluOiBzdHJpbmc7XG4gIHVzZXJOYW1lOiBzdHJpbmc7XG4gIHBhc3N3b3JkOiBzdHJpbmc7XG4gIG50bG1wYWNrZXQ6IHtcbiAgICB0YXJnZXQ6IEJ1ZmZlcjtcbiAgICBub25jZTogQnVmZmVyO1xuICB9O1xufVxuXG5jbGFzcyBOVExNUmVzcG9uc2VQYXlsb2FkIHtcbiAgZGVjbGFyZSBkYXRhOiBCdWZmZXI7XG5cbiAgY29uc3RydWN0b3IobG9naW5EYXRhOiBPcHRpb25zKSB7XG4gICAgdGhpcy5kYXRhID0gdGhpcy5jcmVhdGVSZXNwb25zZShsb2dpbkRhdGEpO1xuICB9XG5cbiAgdG9TdHJpbmcoaW5kZW50ID0gJycpIHtcbiAgICByZXR1cm4gaW5kZW50ICsgJ05UTE0gQXV0aCc7XG4gIH1cblxuICBjcmVhdGVSZXNwb25zZShjaGFsbGVuZ2U6IE9wdGlvbnMpIHtcbiAgICBjb25zdCBjbGllbnRfbm9uY2UgPSB0aGlzLmNyZWF0ZUNsaWVudE5vbmNlKCk7XG4gICAgY29uc3QgbG12MmxlbiA9IDI0O1xuICAgIGNvbnN0IG50bG12MmxlbiA9IDE2O1xuICAgIGNvbnN0IGRvbWFpbiA9IGNoYWxsZW5nZS5kb21haW47XG4gICAgY29uc3QgdXNlcm5hbWUgPSBjaGFsbGVuZ2UudXNlck5hbWU7XG4gICAgY29uc3QgcGFzc3dvcmQgPSBjaGFsbGVuZ2UucGFzc3dvcmQ7XG4gICAgY29uc3QgbnRsbURhdGEgPSBjaGFsbGVuZ2UubnRsbXBhY2tldDtcbiAgICBjb25zdCBzZXJ2ZXJfZGF0YSA9IG50bG1EYXRhLnRhcmdldDtcbiAgICBjb25zdCBzZXJ2ZXJfbm9uY2UgPSBudGxtRGF0YS5ub25jZTtcbiAgICBjb25zdCBidWZmZXJMZW5ndGggPSA2NCArIChkb21haW4ubGVuZ3RoICogMikgKyAodXNlcm5hbWUubGVuZ3RoICogMikgKyBsbXYybGVuICsgbnRsbXYybGVuICsgOCArIDggKyA4ICsgNCArIHNlcnZlcl9kYXRhLmxlbmd0aCArIDQ7XG4gICAgY29uc3QgZGF0YSA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKGJ1ZmZlckxlbmd0aCk7XG4gICAgZGF0YS5wb3NpdGlvbiA9IDA7XG4gICAgZGF0YS53cml0ZVN0cmluZygnTlRMTVNTUFxcdTAwMDAnLCAndXRmOCcpO1xuICAgIGRhdGEud3JpdGVVSW50MzJMRSgweDAzKTtcbiAgICBjb25zdCBiYXNlSWR4ID0gNjQ7XG4gICAgY29uc3QgZG5JZHggPSBiYXNlSWR4O1xuICAgIGNvbnN0IHVuSWR4ID0gZG5JZHggKyBkb21haW4ubGVuZ3RoICogMjtcbiAgICBjb25zdCBsMklkeCA9IHVuSWR4ICsgdXNlcm5hbWUubGVuZ3RoICogMjtcbiAgICBjb25zdCBudElkeCA9IGwySWR4ICsgbG12MmxlbjtcbiAgICBkYXRhLndyaXRlVUludDE2TEUobG12Mmxlbik7XG4gICAgZGF0YS53cml0ZVVJbnQxNkxFKGxtdjJsZW4pO1xuICAgIGRhdGEud3JpdGVVSW50MzJMRShsMklkeCk7XG4gICAgZGF0YS53cml0ZVVJbnQxNkxFKG50bG12Mmxlbik7XG4gICAgZGF0YS53cml0ZVVJbnQxNkxFKG50bG12Mmxlbik7XG4gICAgZGF0YS53cml0ZVVJbnQzMkxFKG50SWR4KTtcbiAgICBkYXRhLndyaXRlVUludDE2TEUoZG9tYWluLmxlbmd0aCAqIDIpO1xuICAgIGRhdGEud3JpdGVVSW50MTZMRShkb21haW4ubGVuZ3RoICogMik7XG4gICAgZGF0YS53cml0ZVVJbnQzMkxFKGRuSWR4KTtcbiAgICBkYXRhLndyaXRlVUludDE2TEUodXNlcm5hbWUubGVuZ3RoICogMik7XG4gICAgZGF0YS53cml0ZVVJbnQxNkxFKHVzZXJuYW1lLmxlbmd0aCAqIDIpO1xuICAgIGRhdGEud3JpdGVVSW50MzJMRSh1bklkeCk7XG4gICAgZGF0YS53cml0ZVVJbnQxNkxFKDApO1xuICAgIGRhdGEud3JpdGVVSW50MTZMRSgwKTtcbiAgICBkYXRhLndyaXRlVUludDMyTEUoYmFzZUlkeCk7XG4gICAgZGF0YS53cml0ZVVJbnQxNkxFKDApO1xuICAgIGRhdGEud3JpdGVVSW50MTZMRSgwKTtcbiAgICBkYXRhLndyaXRlVUludDMyTEUoYmFzZUlkeCk7XG4gICAgZGF0YS53cml0ZVVJbnQxNkxFKDB4ODIwMSk7XG4gICAgZGF0YS53cml0ZVVJbnQxNkxFKDB4MDgpO1xuICAgIGRhdGEud3JpdGVTdHJpbmcoZG9tYWluLCAndWNzMicpO1xuICAgIGRhdGEud3JpdGVTdHJpbmcodXNlcm5hbWUsICd1Y3MyJyk7XG4gICAgY29uc3QgbG12MkRhdGEgPSB0aGlzLmxtdjJSZXNwb25zZShkb21haW4sIHVzZXJuYW1lLCBwYXNzd29yZCwgc2VydmVyX25vbmNlLCBjbGllbnRfbm9uY2UpO1xuICAgIGRhdGEuY29weUZyb20obG12MkRhdGEpO1xuICAgIGNvbnN0IGdlblRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICBjb25zdCBudGxtRGF0YUJ1ZmZlciA9IHRoaXMubnRsbXYyUmVzcG9uc2UoZG9tYWluLCB1c2VybmFtZSwgcGFzc3dvcmQsIHNlcnZlcl9ub25jZSwgc2VydmVyX2RhdGEsIGNsaWVudF9ub25jZSwgZ2VuVGltZSk7XG4gICAgZGF0YS5jb3B5RnJvbShudGxtRGF0YUJ1ZmZlcik7XG4gICAgZGF0YS53cml0ZVVJbnQzMkxFKDB4MDEwMSk7XG4gICAgZGF0YS53cml0ZVVJbnQzMkxFKDB4MDAwMCk7XG4gICAgY29uc3QgdGltZXN0YW1wID0gdGhpcy5jcmVhdGVUaW1lc3RhbXAoZ2VuVGltZSk7XG4gICAgZGF0YS5jb3B5RnJvbSh0aW1lc3RhbXApO1xuICAgIGRhdGEuY29weUZyb20oY2xpZW50X25vbmNlKTtcbiAgICBkYXRhLndyaXRlVUludDMyTEUoMHgwMDAwKTtcbiAgICBkYXRhLmNvcHlGcm9tKHNlcnZlcl9kYXRhKTtcbiAgICBkYXRhLndyaXRlVUludDMyTEUoMHgwMDAwKTtcbiAgICByZXR1cm4gZGF0YS5kYXRhO1xuICB9XG5cbiAgY3JlYXRlQ2xpZW50Tm9uY2UoKSB7XG4gICAgY29uc3QgY2xpZW50X25vbmNlID0gQnVmZmVyLmFsbG9jKDgsIDApO1xuICAgIGxldCBuaWR4ID0gMDtcbiAgICB3aGlsZSAobmlkeCA8IDgpIHtcbiAgICAgIGNsaWVudF9ub25jZS53cml0ZVVJbnQ4KE1hdGguY2VpbChNYXRoLnJhbmRvbSgpICogMjU1KSwgbmlkeCk7XG4gICAgICBuaWR4Kys7XG4gICAgfVxuICAgIHJldHVybiBjbGllbnRfbm9uY2U7XG4gIH1cblxuICBudGxtdjJSZXNwb25zZShkb21haW46IHN0cmluZywgdXNlcjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBzZXJ2ZXJOb25jZTogQnVmZmVyLCB0YXJnZXRJbmZvOiBCdWZmZXIsIGNsaWVudE5vbmNlOiBCdWZmZXIsIG15dGltZTogbnVtYmVyKSB7XG4gICAgY29uc3QgdGltZXN0YW1wID0gdGhpcy5jcmVhdGVUaW1lc3RhbXAobXl0aW1lKTtcbiAgICBjb25zdCBoYXNoID0gdGhpcy5udHYySGFzaChkb21haW4sIHVzZXIsIHBhc3N3b3JkKTtcbiAgICBjb25zdCBkYXRhTGVuZ3RoID0gNDAgKyB0YXJnZXRJbmZvLmxlbmd0aDtcbiAgICBjb25zdCBkYXRhID0gQnVmZmVyLmFsbG9jKGRhdGFMZW5ndGgsIDApO1xuICAgIHNlcnZlck5vbmNlLmNvcHkoZGF0YSwgMCwgMCwgOCk7XG4gICAgZGF0YS53cml0ZVVJbnQzMkxFKDB4MTAxLCA4KTtcbiAgICBkYXRhLndyaXRlVUludDMyTEUoMHgwLCAxMik7XG4gICAgdGltZXN0YW1wLmNvcHkoZGF0YSwgMTYsIDAsIDgpO1xuICAgIGNsaWVudE5vbmNlLmNvcHkoZGF0YSwgMjQsIDAsIDgpO1xuICAgIGRhdGEud3JpdGVVSW50MzJMRSgweDAsIDMyKTtcbiAgICB0YXJnZXRJbmZvLmNvcHkoZGF0YSwgMzYsIDAsIHRhcmdldEluZm8ubGVuZ3RoKTtcbiAgICBkYXRhLndyaXRlVUludDMyTEUoMHgwLCAzNiArIHRhcmdldEluZm8ubGVuZ3RoKTtcbiAgICByZXR1cm4gdGhpcy5obWFjTUQ1KGRhdGEsIGhhc2gpO1xuICB9XG5cbiAgY3JlYXRlVGltZXN0YW1wKHRpbWU6IG51bWJlcikge1xuICAgIGNvbnN0IHRlbnRoc09mQU1pY3Jvc2Vjb25kID0gKEJpZ0ludCh0aW1lKSArIEJpZ0ludCgxMTY0NDQ3MzYwMCkpICogQmlnSW50KDEwMDAwMDAwKTtcblxuICAgIGNvbnN0IGxvID0gTnVtYmVyKHRlbnRoc09mQU1pY3Jvc2Vjb25kICYgQmlnSW50KDB4ZmZmZmZmZmYpKTtcbiAgICBjb25zdCBoaSA9IE51bWJlcigodGVudGhzT2ZBTWljcm9zZWNvbmQgPj4gQmlnSW50KDMyKSkgJiBCaWdJbnQoMHhmZmZmZmZmZikpO1xuXG4gICAgY29uc3QgcmVzdWx0ID0gQnVmZmVyLmFsbG9jKDgpO1xuICAgIHJlc3VsdC53cml0ZVVJbnQzMkxFKGxvLCAwKTtcbiAgICByZXN1bHQud3JpdGVVSW50MzJMRShoaSwgNCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGxtdjJSZXNwb25zZShkb21haW46IHN0cmluZywgdXNlcjogc3RyaW5nLCBwYXNzd29yZDogc3RyaW5nLCBzZXJ2ZXJOb25jZTogQnVmZmVyLCBjbGllbnROb25jZTogQnVmZmVyKSB7XG4gICAgY29uc3QgaGFzaCA9IHRoaXMubnR2Mkhhc2goZG9tYWluLCB1c2VyLCBwYXNzd29yZCk7XG4gICAgY29uc3QgZGF0YSA9IEJ1ZmZlci5hbGxvYyhzZXJ2ZXJOb25jZS5sZW5ndGggKyBjbGllbnROb25jZS5sZW5ndGgsIDApO1xuXG4gICAgc2VydmVyTm9uY2UuY29weShkYXRhKTtcbiAgICBjbGllbnROb25jZS5jb3B5KGRhdGEsIHNlcnZlck5vbmNlLmxlbmd0aCwgMCwgY2xpZW50Tm9uY2UubGVuZ3RoKTtcblxuICAgIGNvbnN0IG5ld2hhc2ggPSB0aGlzLmhtYWNNRDUoZGF0YSwgaGFzaCk7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBCdWZmZXIuYWxsb2MobmV3aGFzaC5sZW5ndGggKyBjbGllbnROb25jZS5sZW5ndGgsIDApO1xuXG4gICAgbmV3aGFzaC5jb3B5KHJlc3BvbnNlKTtcbiAgICBjbGllbnROb25jZS5jb3B5KHJlc3BvbnNlLCBuZXdoYXNoLmxlbmd0aCwgMCwgY2xpZW50Tm9uY2UubGVuZ3RoKTtcblxuICAgIHJldHVybiByZXNwb25zZTtcbiAgfVxuXG4gIG50djJIYXNoKGRvbWFpbjogc3RyaW5nLCB1c2VyOiBzdHJpbmcsIHBhc3N3b3JkOiBzdHJpbmcpIHtcbiAgICBjb25zdCBoYXNoID0gdGhpcy5udEhhc2gocGFzc3dvcmQpO1xuICAgIGNvbnN0IGlkZW50aXR5ID0gQnVmZmVyLmZyb20odXNlci50b1VwcGVyQ2FzZSgpICsgZG9tYWluLnRvVXBwZXJDYXNlKCksICd1Y3MyJyk7XG4gICAgcmV0dXJuIHRoaXMuaG1hY01ENShpZGVudGl0eSwgaGFzaCk7XG4gIH1cblxuICBudEhhc2godGV4dDogc3RyaW5nKSB7XG4gICAgY29uc3QgdW5pY29kZVN0cmluZyA9IEJ1ZmZlci5mcm9tKHRleHQsICd1Y3MyJyk7XG4gICAgcmV0dXJuIEJ1ZmZlci5mcm9tKG1kNC5hcnJheUJ1ZmZlcih1bmljb2RlU3RyaW5nKSk7XG4gIH1cblxuICBobWFjTUQ1KGRhdGE6IEJ1ZmZlciwga2V5OiBCdWZmZXIpIHtcbiAgICByZXR1cm4gY3J5cHRvLmNyZWF0ZUhtYWMoJ01ENScsIGtleSkudXBkYXRlKGRhdGEpLmRpZ2VzdCgpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5UTE1SZXNwb25zZVBheWxvYWQ7XG5tb2R1bGUuZXhwb3J0cyA9IE5UTE1SZXNwb25zZVBheWxvYWQ7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLHVCQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxNQUFBLEdBQUFDLHVCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBRyxLQUFBLEdBQUFKLHNCQUFBLENBQUFDLE9BQUE7QUFBeUIsU0FBQUUsd0JBQUFFLENBQUEsRUFBQUMsQ0FBQSw2QkFBQUMsT0FBQSxNQUFBQyxDQUFBLE9BQUFELE9BQUEsSUFBQUUsQ0FBQSxPQUFBRixPQUFBLFlBQUFKLHVCQUFBLFlBQUFBLENBQUFFLENBQUEsRUFBQUMsQ0FBQSxTQUFBQSxDQUFBLElBQUFELENBQUEsSUFBQUEsQ0FBQSxDQUFBSyxVQUFBLFNBQUFMLENBQUEsTUFBQU0sQ0FBQSxFQUFBQyxDQUFBLEVBQUFDLENBQUEsS0FBQUMsU0FBQSxRQUFBQyxPQUFBLEVBQUFWLENBQUEsaUJBQUFBLENBQUEsdUJBQUFBLENBQUEseUJBQUFBLENBQUEsU0FBQVEsQ0FBQSxNQUFBRixDQUFBLEdBQUFMLENBQUEsR0FBQUcsQ0FBQSxHQUFBRCxDQUFBLFFBQUFHLENBQUEsQ0FBQUssR0FBQSxDQUFBWCxDQUFBLFVBQUFNLENBQUEsQ0FBQU0sR0FB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QUFJLENBQUN4RCxJQUFJLEVBQUVpRCxXQUFXLENBQUM3QixNQUFNLEVBQUUsQ0FBQyxFQUFFK0IsV0FBVyxDQUFDL0IsTUFBTSxDQUFDO0lBRWpFLE1BQU02QyxPQUFPLEdBQUcsSUFBSSxDQUFDUixPQUFPLENBQUN6RCxJQUFJLEVBQUVxRCxJQUFJLENBQUM7SUFDeEMsTUFBTWEsUUFBUSxHQUFHekIsTUFBTSxDQUFDQyxLQUFLLENBQUN1QixPQUFPLENBQUM3QyxNQUFNLEdBQUcrQixXQUFXLENBQUMvQixNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBRXJFNkMsT0FBTyxDQUFDVCxJQUFJLENBQUNVLFFBQVEsQ0FBQztJQUN0QmYsV0FBVyxDQUFDSyxJQUFJLENBQUNVLFFBQVEsRUFBRUQsT0FBTyxDQUFDN0MsTUFBTSxFQUFFLENBQUMsRUFBRStCLFdBQVcsQ0FBQy9CLE1BQU0sQ0FBQztJQUVqRSxPQUFPOEMsUUFBUTtFQUNqQjtFQUVBWixRQUFRQSxDQUFDN0MsTUFBYyxFQUFFdUMsSUFBWSxFQUFFcEMsUUFBZ0IsRUFBRTtJQUN2RCxNQUFNeUMsSUFBSSxHQUFHLElBQUksQ0FBQ2MsTUFBTSxDQUFDdkQsUUFBUSxDQUFDO0lBQ2xDLE1BQU13RCxRQUFRLEdBQUczQixNQUFNLENBQUM0QixJQUFJLENBQUNyQixJQUFJLENBQUNzQixXQUFXLENBQUMsQ0FBQyxHQUFHN0QsTUFBTSxDQUFDNkQsV0FBVyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUM7SUFDL0UsT0FBTyxJQUFJLENBQUNiLE9BQU8sQ0FBQ1csUUFBUSxFQUFFZixJQUFJLENBQUM7RUFDckM7RUFFQWMsTUFBTUEsQ0FBQ0ksSUFBWSxFQUFFO0lBQ25CLE1BQU1DLGFBQWEsR0FBRy9CLE1BQU0sQ0FBQzRCLElBQUksQ0FBQ0UsSUFBSSxFQUFFLE1BQU0sQ0FBQztJQUMvQyxPQUFPOUIsTUFBTSxDQUFDNEIsSUFBSSxDQUFDSSxhQUFHLENBQUNDLFdBQVcsQ0FBQ0YsYUFBYSxDQUFDLENBQUM7RUFDcEQ7RUFFQWYsT0FBT0EsQ0FBQ3pELElBQVksRUFBRTJFLEdBQVcsRUFBRTtJQUNqQyxPQUFPcEcsTUFBTSxDQUFDcUcsVUFBVSxDQUFDLEtBQUssRUFBRUQsR0FBRyxDQUFDLENBQUNFLE1BQU0sQ0FBQzdFLElBQUksQ0FBQyxDQUFDOEUsTUFBTSxDQUFDLENBQUM7RUFDNUQ7QUFDRjtBQUFDLElBQUFDLFFBQUEsR0FBQUMsT0FBQSxDQUFBNUYsT0FBQSxHQUVjUyxtQkFBbUI7QUFDbENvRixNQUFNLENBQUNELE9BQU8sR0FBR25GLG1CQUFtQiIsImlnbm9yZUxpc3QiOltdfQ==
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/errors.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RequestError = exports.InputError = exports.ConnectionError = void 0;
class ConnectionError extends Error {
    constructor(message, code, options){
        super(message, options);
        this.code = code;
    }
}
exports.ConnectionError = ConnectionError;
class RequestError extends Error {
    constructor(message, code, options){
        super(message, options);
        this.code = code;
    }
}
exports.RequestError = RequestError;
class InputError extends TypeError {
}
exports.InputError = InputError; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDb25uZWN0aW9uRXJyb3IiLCJFcnJvciIsImNvbnN0cnVjdG9yIiwibWVzc2FnZSIsImNvZGUiLCJvcHRpb25zIiwiZXhwb3J0cyIsIlJlcXVlc3RFcnJvciIsIklucHV0RXJyb3IiLCJUeXBlRXJyb3IiXSwic291cmNlcyI6WyIuLi9zcmMvZXJyb3JzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBDb25uZWN0aW9uRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGRlY2xhcmUgY29kZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIGRlY2xhcmUgaXNUcmFuc2llbnQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nLCBjb2RlPzogc3RyaW5nLCBvcHRpb25zPzogRXJyb3JPcHRpb25zKSB7XG4gICAgc3VwZXIobWVzc2FnZSwgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvZGUgPSBjb2RlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZXF1ZXN0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG4gIGRlY2xhcmUgY29kZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gIGRlY2xhcmUgbnVtYmVyOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIGRlY2xhcmUgc3RhdGU6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgZGVjbGFyZSBjbGFzczogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBkZWNsYXJlIHNlcnZlck5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgZGVjbGFyZSBwcm9jTmFtZTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBkZWNsYXJlIGxpbmVOdW1iZXI6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIGNvZGU/OiBzdHJpbmcsIG9wdGlvbnM/OiBFcnJvck9wdGlvbnMpIHtcbiAgICBzdXBlcihtZXNzYWdlLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29kZSA9IGNvZGU7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIElucHV0RXJyb3IgZXh0ZW5kcyBUeXBlRXJyb3Ige31cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQU8sTUFBTUEsZUFBZSxTQUFTQyxLQUFLLENBQUM7RUFLekNDLFdBQVdBLENBQUNDLE9BQWUsRUFBRUMsSUFBYSxFQUFFQyxPQUFzQixFQUFFO0lBQ2xFLEtBQUssQ0FBQ0YsT0FBTyxFQUFFRSxPQUFPLENBQUM7SUFFdkIsSUFBSSxDQUFDRCxJQUFJLEdBQUdBLElBQUk7RUFDbEI7QUFDRjtBQUFDRSxPQUFBLENBQUFOLGVBQUEsR0FBQUEsZUFBQTtBQUVNLE1BQU1PLFlBQVksU0FBU04sS0FBSyxDQUFDO0VBVXRDQyxXQUFXQSxDQUFDQyxPQUFlLEVBQUVDLElBQWEsRUFBRUMsT0FBc0IsRUFBRTtJQUNsRSxLQUFLLENBQUNGLE9BQU8sRUFBRUUsT0FBTyxDQUFDO0lBRXZCLElBQUksQ0FBQ0QsSUFBSSxHQUFHQSxJQUFJO0VBQ2xCO0FBQ0Y7QUFBQ0UsT0FBQSxDQUFBQyxZQUFBLEdBQUFBLFlBQUE7QUFFTSxNQUFNQyxVQUFVLFNBQVNDLFNBQVMsQ0FBQztBQUFFSCxPQUFBLENBQUFFLFVBQUEsR0FBQUEsVUFBQSIsImlnbm9yZUxpc3QiOltdfQ==
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/always-encrypted/types.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SQLServerStatementColumnEncryptionSetting = exports.SQLServerEncryptionType = exports.DescribeParameterEncryptionResultSet2 = exports.DescribeParameterEncryptionResultSet1 = void 0;
// This code is based on the `mssql-jdbc` library published under the conditions of MIT license.
// Copyright (c) 2019 Microsoft Corporation
let SQLServerEncryptionType = exports.SQLServerEncryptionType = /*#__PURE__*/ function(SQLServerEncryptionType) {
    SQLServerEncryptionType[SQLServerEncryptionType["Deterministic"] = 1] = "Deterministic";
    SQLServerEncryptionType[SQLServerEncryptionType["Randomized"] = 2] = "Randomized";
    SQLServerEncryptionType[SQLServerEncryptionType["PlainText"] = 0] = "PlainText";
    return SQLServerEncryptionType;
}({});
// Fields in the first resultset of "sp_describe_parameter_encryption"
// We expect the server to return the fields in the resultset in the same order as mentioned below.
// If the server changes the below order, then transparent parameter encryption will break.
let DescribeParameterEncryptionResultSet1 = exports.DescribeParameterEncryptionResultSet1 = /*#__PURE__*/ function(DescribeParameterEncryptionResultSet1) {
    DescribeParameterEncryptionResultSet1[DescribeParameterEncryptionResultSet1["KeyOrdinal"] = 0] = "KeyOrdinal";
    DescribeParameterEncryptionResultSet1[DescribeParameterEncryptionResultSet1["DbId"] = 1] = "DbId";
    DescribeParameterEncryptionResultSet1[DescribeParameterEncryptionResultSet1["KeyId"] = 2] = "KeyId";
    DescribeParameterEncryptionResultSet1[DescribeParameterEncryptionResultSet1["KeyVersion"] = 3] = "KeyVersion";
    DescribeParameterEncryptionResultSet1[DescribeParameterEncryptionResultSet1["KeyMdVersion"] = 4] = "KeyMdVersion";
    DescribeParameterEncryptionResultSet1[DescribeParameterEncryptionResultSet1["EncryptedKey"] = 5] = "EncryptedKey";
    DescribeParameterEncryptionResultSet1[DescribeParameterEncryptionResultSet1["ProviderName"] = 6] = "ProviderName";
    DescribeParameterEncryptionResultSet1[DescribeParameterEncryptionResultSet1["KeyPath"] = 7] = "KeyPath";
    DescribeParameterEncryptionResultSet1[DescribeParameterEncryptionResultSet1["KeyEncryptionAlgorithm"] = 8] = "KeyEncryptionAlgorithm";
    return DescribeParameterEncryptionResultSet1;
}({}); // Fields in the second resultset of "sp_describe_parameter_encryption"
// We expect the server to return the fields in the resultset in the same order as mentioned below.
// If the server changes the below order, then transparent parameter encryption will break.
let DescribeParameterEncryptionResultSet2 = exports.DescribeParameterEncryptionResultSet2 = /*#__PURE__*/ function(DescribeParameterEncryptionResultSet2) {
    DescribeParameterEncryptionResultSet2[DescribeParameterEncryptionResultSet2["ParameterOrdinal"] = 0] = "ParameterOrdinal";
    DescribeParameterEncryptionResultSet2[DescribeParameterEncryptionResultSet2["ParameterName"] = 1] = "ParameterName";
    DescribeParameterEncryptionResultSet2[DescribeParameterEncryptionResultSet2["ColumnEncryptionAlgorithm"] = 2] = "ColumnEncryptionAlgorithm";
    DescribeParameterEncryptionResultSet2[DescribeParameterEncryptionResultSet2["ColumnEncrytionType"] = 3] = "ColumnEncrytionType";
    DescribeParameterEncryptionResultSet2[DescribeParameterEncryptionResultSet2["ColumnEncryptionKeyOrdinal"] = 4] = "ColumnEncryptionKeyOrdinal";
    DescribeParameterEncryptionResultSet2[DescribeParameterEncryptionResultSet2["NormalizationRuleVersion"] = 5] = "NormalizationRuleVersion";
    return DescribeParameterEncryptionResultSet2;
}({});
let SQLServerStatementColumnEncryptionSetting = exports.SQLServerStatementColumnEncryptionSetting = /*#__PURE__*/ function(SQLServerStatementColumnEncryptionSetting) {
    /**
   * if "Column Encryption Setting=Enabled" in the connection string, use Enabled. Otherwise, maps to Disabled.
   */ SQLServerStatementColumnEncryptionSetting[SQLServerStatementColumnEncryptionSetting["UseConnectionSetting"] = 0] = "UseConnectionSetting";
    /**
   * Enables TCE for the command. Overrides the connection level setting for this command.
   */ SQLServerStatementColumnEncryptionSetting[SQLServerStatementColumnEncryptionSetting["Enabled"] = 1] = "Enabled";
    /**
   * Parameters will not be encrypted, only the ResultSet will be decrypted. This is an optimization for queries that
   * do not pass any encrypted input parameters. Overrides the connection level setting for this command.
   */ SQLServerStatementColumnEncryptionSetting[SQLServerStatementColumnEncryptionSetting["ResultSetOnly"] = 2] = "ResultSetOnly";
    /**
   * Disables TCE for the command.Overrides the connection level setting for this command.
   */ SQLServerStatementColumnEncryptionSetting[SQLServerStatementColumnEncryptionSetting["Disabled"] = 3] = "Disabled";
    return SQLServerStatementColumnEncryptionSetting;
}({}); //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJTUUxTZXJ2ZXJFbmNyeXB0aW9uVHlwZSIsImV4cG9ydHMiLCJEZXNjcmliZVBhcmFtZXRlckVuY3J5cHRpb25SZXN1bHRTZXQxIiwiRGVzY3JpYmVQYXJhbWV0ZXJFbmNyeXB0aW9uUmVzdWx0U2V0MiIsIlNRTFNlcnZlclN0YXRlbWVudENvbHVtbkVuY3J5cHRpb25TZXR0aW5nIl0sInNvdXJjZXMiOlsiLi4vLi4vc3JjL2Fsd2F5cy1lbmNyeXB0ZWQvdHlwZXMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gVGhpcyBjb2RlIGlzIGJhc2VkIG9uIHRoZSBgbXNzcWwtamRiY2AgbGlicmFyeSBwdWJsaXNoZWQgdW5kZXIgdGhlIGNvbmRpdGlvbnMgb2YgTUlUIGxpY2Vuc2UuXG4vLyBDb3B5cmlnaHQgKGMpIDIwMTkgTWljcm9zb2Z0IENvcnBvcmF0aW9uXG5cbmltcG9ydCB7IENFS0VudHJ5IH0gZnJvbSAnLi9jZWstZW50cnknO1xuaW1wb3J0IHsgdHlwZSBCYXNlTWV0YWRhdGEgfSBmcm9tICcuLi9tZXRhZGF0YS1wYXJzZXInO1xuXG5leHBvcnQgaW50ZXJmYWNlIEVuY3J5cHRpb25LZXlJbmZvIHtcbiAgZW5jcnlwdGVkS2V5OiBCdWZmZXI7XG4gIGRiSWQ6IG51bWJlcjtcbiAga2V5SWQ6IG51bWJlcjtcbiAga2V5VmVyc2lvbjogbnVtYmVyO1xuICBtZFZlcnNpb246IEJ1ZmZlcjtcbiAga2V5UGF0aDogc3RyaW5nO1xuICBrZXlTdG9yZU5hbWU6IHN0cmluZztcbiAgYWxnb3JpdGhtTmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgZW51bSBTUUxTZXJ2ZXJFbmNyeXB0aW9uVHlwZSB7XG4gIERldGVybWluaXN0aWMgPSAxLFxuICBSYW5kb21pemVkID0gMixcbiAgUGxhaW5UZXh0ID0gMCxcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbmNyeXB0aW9uQWxnb3JpdGhtIHtcbiAgZW5jcnlwdERhdGE6IChwbGFpblRleHQ6IEJ1ZmZlcikgPT4gQnVmZmVyO1xuICBkZWNyeXB0RGF0YTogKGNpcGhlclRleHQ6IEJ1ZmZlcikgPT4gQnVmZmVyO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENyeXB0b01ldGFkYXRhIHtcbiAgY2VrRW50cnk/OiBDRUtFbnRyeTtcbiAgY2lwaGVyQWxnb3JpdGhtSWQ6IG51bWJlcjtcbiAgY2lwaGVyQWxnb3JpdGhtTmFtZT86IHN0cmluZztcbiAgbm9ybWFsaXphdGlvblJ1bGVWZXJzaW9uOiBCdWZmZXI7XG4gIGVuY3J5cHRpb25LZXlJbmZvPzogRW5jcnlwdGlvbktleUluZm87XG4gIG9yZGluYWw6IG51bWJlcjtcbiAgZW5jcnlwdGlvblR5cGU6IFNRTFNlcnZlckVuY3J5cHRpb25UeXBlO1xuICBjaXBoZXJBbGdvcml0aG0/OiBFbmNyeXB0aW9uQWxnb3JpdGhtO1xuICBiYXNlVHlwZUluZm8/OiBCYXNlTWV0YWRhdGE7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGFzaE1hcDxUPiB7XG4gIFtoYXNoOiBzdHJpbmddOiBUO1xufVxuXG5cbi8vIEZpZWxkcyBpbiB0aGUgZmlyc3QgcmVzdWx0c2V0IG9mIFwic3BfZGVzY3JpYmVfcGFyYW1ldGVyX2VuY3J5cHRpb25cIlxuLy8gV2UgZXhwZWN0IHRoZSBzZXJ2ZXIgdG8gcmV0dXJuIHRoZSBmaWVsZHMgaW4gdGhlIHJlc3VsdHNldCBpbiB0aGUgc2FtZSBvcmRlciBhcyBtZW50aW9uZWQgYmVsb3cuXG4vLyBJZiB0aGUgc2VydmVyIGNoYW5nZXMgdGhlIGJlbG93IG9yZGVyLCB0aGVuIHRyYW5zcGFyZW50IHBhcmFtZXRlciBlbmNyeXB0aW9uIHdpbGwgYnJlYWsuXG5leHBvcnQgZW51bSBEZXNjcmliZVBhcmFtZXRlckVuY3J5cHRpb25SZXN1bHRTZXQxIHtcbiAgS2V5T3JkaW5hbCxcbiAgRGJJZCxcbiAgS2V5SWQsXG4gIEtleVZlcnNpb24sXG4gIEtleU1kVmVyc2lvbixcbiAgRW5jcnlwdGVkS2V5LFxuICBQcm92aWRlck5hbWUsXG4gIEtleVBhdGgsXG4gIEtleUVuY3J5cHRpb25BbGdvcml0aG1cbn1cblxuXG4vLyBGaWVsZHMgaW4gdGhlIHNlY29uZCByZXN1bHRzZXQgb2YgXCJzcF9kZXNjcmliZV9wYXJhbWV0ZXJfZW5jcnlwdGlvblwiXG4vLyBXZSBleHBlY3QgdGhlIHNlcnZlciB0byByZXR1cm4gdGhlIGZpZWxkcyBpbiB0aGUgcmVzdWx0c2V0IGluIHRoZSBzYW1lIG9yZGVyIGFzIG1lbnRpb25lZCBiZWxvdy5cbi8vIElmIHRoZSBzZXJ2ZXIgY2hhbmdlcyB0aGUgYmVsb3cgb3JkZXIsIHRoZW4gdHJhbnNwYXJlbnQgcGFyYW1ldGVyIGVuY3J5cHRpb24gd2lsbCBicmVhay5cbmV4cG9ydCBlbnVtIERlc2NyaWJlUGFyYW1ldGVyRW5jcnlwdGlvblJlc3VsdFNldDIge1xuICBQYXJhbWV0ZXJPcmRpbmFsLFxuICBQYXJhbWV0ZXJOYW1lLFxuICBDb2x1bW5FbmNyeXB0aW9uQWxnb3JpdGhtLFxuICBDb2x1bW5FbmNyeXRpb25UeXBlLFxuICBDb2x1bW5FbmNyeXB0aW9uS2V5T3JkaW5hbCxcbiAgTm9ybWFsaXphdGlvblJ1bGVWZXJzaW9uXG59XG5cbmV4cG9ydCBlbnVtIFNRTFNlcnZlclN0YXRlbWVudENvbHVtbkVuY3J5cHRpb25TZXR0aW5nIHtcbiAgLyoqXG4gICAqIGlmIFwiQ29sdW1uIEVuY3J5cHRpb24gU2V0dGluZz1FbmFibGVkXCIgaW4gdGhlIGNvbm5lY3Rpb24gc3RyaW5nLCB1c2UgRW5hYmxlZC4gT3RoZXJ3aXNlLCBtYXBzIHRvIERpc2FibGVkLlxuICAgKi9cbiAgVXNlQ29ubmVjdGlvblNldHRpbmcsXG4gIC8qKlxuICAgKiBFbmFibGVzIFRDRSBmb3IgdGhlIGNvbW1hbmQuIE92ZXJyaWRlcyB0aGUgY29ubmVjdGlvbiBsZXZlbCBzZXR0aW5nIGZvciB0aGlzIGNvbW1hbmQuXG4gICAqL1xuICBFbmFibGVkLFxuICAvKipcbiAgICogUGFyYW1ldGVycyB3aWxsIG5vdCBiZSBlbmNyeXB0ZWQsIG9ubHkgdGhlIFJlc3VsdFNldCB3aWxsIGJlIGRlY3J5cHRlZC4gVGhpcyBpcyBhbiBvcHRpbWl6YXRpb24gZm9yIHF1ZXJpZXMgdGhhdFxuICAgKiBkbyBub3QgcGFzcyBhbnkgZW5jcnlwdGVkIGlucHV0IHBhcmFtZXRlcnMuIE92ZXJyaWRlcyB0aGUgY29ubmVjdGlvbiBsZXZlbCBzZXR0aW5nIGZvciB0aGlzIGNvbW1hbmQuXG4gICAqL1xuICBSZXN1bHRTZXRPbmx5LFxuICAvKipcbiAgICogRGlzYWJsZXMgVENFIGZvciB0aGUgY29tbWFuZC5PdmVycmlkZXMgdGhlIGNvbm5lY3Rpb24gbGV2ZWwgc2V0dGluZyBmb3IgdGhpcyBjb21tYW5kLlxuICAgKi9cbiAgRGlzYWJsZWQsXG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFBQSxJQWdCWUEsdUJBQXVCLEdBQUFDLE9BQUEsQ0FBQUQsdUJBQUEsMEJBQXZCQSx1QkFBdUI7RUFBdkJBLHVCQUF1QixDQUF2QkEsdUJBQXVCO0VBQXZCQSx1QkFBdUIsQ0FBdkJBLHVCQUF1QjtFQUF2QkEsdUJBQXVCLENBQXZCQSx1QkFBdUI7RUFBQSxPQUF2QkEsdUJBQXVCO0FBQUE7QUE0Qm5DO0FBQ0E7QUFDQTtBQUFBLElBQ1lFLHFDQUFxQyxHQUFBRCxPQUFBLENBQUFDLHFDQUFBLDBCQUFyQ0EscUNBQXFDO0VBQXJDQSxxQ0FBcUMsQ0FBckNBLHFDQUFxQztFQUFyQ0EscUNBQXFDLENBQXJDQSxxQ0FBcUM7RUFBckNBLHFDQUFxQyxDQUFyQ0EscUNBQXFDO0VBQXJDQSxxQ0FBcUMsQ0FBckNBLHFDQUFxQztFQUFyQ0EscUNBQXFDLENBQXJDQSxxQ0FBcUM7RUFBckNBLHFDQUFxQyxDQUFyQ0EscUNBQXFDO0VBQXJDQSxxQ0FBcUMsQ0FBckNBLHFDQUFxQztFQUFyQ0EscUNBQXFDLENBQXJDQSxxQ0FBcUM7RUFBckNBLHFDQUFxQyxDQUFyQ0EscUNBQXFDO0VBQUEsT0FBckNBLHFDQUFxQztBQUFBLE9BYWpEO0FBQ0E7QUFDQTtBQUFBLElBQ1lDLHFDQUFxQyxHQUFBRixPQUFBLENBQUFFLHFDQUFBLDBCQUFyQ0EscUNBQXFDO0VBQXJDQSxxQ0FBcUMsQ0FBckNBLHFDQUFxQztFQUFyQ0EscUNBQXFDLENBQXJDQSxxQ0FBcUM7RUFBckNBLHFDQUFxQyxDQUFyQ0EscUNBQXFDO0VBQXJDQSxxQ0FBcUMsQ0FBckNBLHFDQUFxQztFQUFyQ0EscUNBQXFDLENBQXJDQSxxQ0FBcUM7RUFBckNBLHFDQUFxQyxDQUFyQ0EscUNBQXFDO0VBQUEsT0FBckNBLHFDQUFxQztBQUFBO0FBQUEsSUFTckNDLHlDQUF5QyxHQUFBSCxPQUFBLENBQUFHLHlDQUFBLDBCQUF6Q0EseUNBQXlDO0VBQ25EO0FBQ0Y7QUFDQTtFQUhZQSx5Q0FBeUMsQ0FBekNBLHlDQUF5QztFQUtuRDtBQUNGO0FBQ0E7RUFQWUEseUNBQXlDLENBQXpDQSx5Q0FBeUM7RUFTbkQ7QUFDRjtBQUNBO0FBQ0E7RUFaWUEseUNBQXlDLENBQXpDQSx5Q0FBeUM7RUFjbkQ7QUFDRjtBQUNBO0VBaEJZQSx5Q0FBeUMsQ0FBekNBLHlDQUF5QztFQUFBLE9BQXpDQSx5Q0FBeUM7QUFBQSIsImlnbm9yZUxpc3QiOltdfQ==
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/request.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _events = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
var _errors = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/errors.js [app-route] (ecmascript)");
var _types = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/always-encrypted/types.js [app-route] (ecmascript)");
/**
 * The callback is called when the request has completed, either successfully or with an error.
 * If an error occurs during execution of the statement(s), then `err` will describe the error.
 *
 * As only one request at a time may be executed on a connection, another request should not
 * be initiated until this callback is called.
 *
 * This callback is called before `requestCompleted` is emitted.
 */ /**
 * ```js
 * const { Request } = require('tedious');
 * const request = new Request("select 42, 'hello world'", (err, rowCount) {
 *   // Request completion callback...
 * });
 * connection.execSql(request);
 * ```
 */ class Request extends _events.EventEmitter {
    /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * This event, describing result set columns, will be emitted before row
   * events are emitted. This event may be emitted multiple times when more
   * than one recordset is produced by the statement.
   *
   * An array like object, where the columns can be accessed either by index
   * or name. Columns with a name that is an integer are not accessible by name,
   * as it would be interpreted as an array index.
   */ /**
   * The request has been prepared and can be used in subsequent calls to execute and unprepare.
   */ /**
   * The request encountered an error and has not been prepared.
   */ /**
   * A row resulting from execution of the SQL statement.
   */ /**
   * All rows from a result set have been provided (through `row` events).
   *
   * This token is used to indicate the completion of a SQL statement.
   * As multiple SQL statements can be sent to the server in a single SQL batch, multiple `done` can be generated.
   * An `done` event is emitted for each SQL statement in the SQL batch except variable declarations.
   * For execution of SQL statements within stored procedures, `doneProc` and `doneInProc` events are used in place of `done`.
   *
   * If you are using [[Connection.execSql]] then SQL server may treat the multiple calls with the same query as a stored procedure.
   * When this occurs, the `doneProc` and `doneInProc` events may be emitted instead. You must handle both events to ensure complete coverage.
   */ /**
   * `request.on('doneInProc', function (rowCount, more, rows) { });`
   *
   * Indicates the completion status of a SQL statement within a stored procedure. All rows from a statement
   * in a stored procedure have been provided (through `row` events).
   *
   * This event may also occur when executing multiple calls with the same query using [[execSql]].
   */ /**
   * Indicates the completion status of a stored procedure. This is also generated for stored procedures
   * executed through SQL statements.\
   * This event may also occur when executing multiple calls with the same query using [[execSql]].
   */ /**
   * A value for an output parameter (that was added to the request with [[addOutputParameter]]).
   * See also `Using Parameters`.
   */ /**
   * This event gives the columns by which data is ordered, if `ORDER BY` clause is executed in SQL Server.
   */ on(event, listener) {
        return super.on(event, listener);
    }
    /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ /**
   * @private
   */ emit(event, ...args) {
        return super.emit(event, ...args);
    }
    /**
   * @param sqlTextOrProcedure
   *   The SQL statement to be executed
   *
   * @param callback
   *   The callback to execute once the request has been fully completed.
   */ constructor(sqlTextOrProcedure, callback, options){
        super();
        this.sqlTextOrProcedure = sqlTextOrProcedure;
        this.parameters = [];
        this.parametersByName = {};
        this.preparing = false;
        this.handle = undefined;
        this.canceled = false;
        this.paused = false;
        this.error = undefined;
        this.connection = undefined;
        this.timeout = undefined;
        this.userCallback = callback;
        this.statementColumnEncryptionSetting = options && options.statementColumnEncryptionSetting || _types.SQLServerStatementColumnEncryptionSetting.UseConnectionSetting;
        this.cryptoMetadataLoaded = false;
        this.callback = function(err, rowCount, rows) {
            if (this.preparing) {
                this.preparing = false;
                if (err) {
                    this.emit('error', err);
                } else {
                    this.emit('prepared');
                }
            } else {
                this.userCallback(err, rowCount, rows);
                this.emit('requestCompleted');
            }
        };
    }
    /**
   * @param name
   *   The parameter name. This should correspond to a parameter in the SQL,
   *   or a parameter that a called procedure expects. The name should not start with `@`.
   *
   * @param type
   *   One of the supported data types.
   *
   * @param value
   *   The value that the parameter is to be given. The Javascript type of the
   *   argument should match that documented for data types.
   *
   * @param options
   *   Additional type options. Optional.
   */ // TODO: `type` must be a valid TDS value type
    addParameter(name, type, value, options) {
        const { output = false, length, precision, scale } = options ?? {};
        const parameter = {
            type: type,
            name: name,
            value: value,
            output: output,
            length: length,
            precision: precision,
            scale: scale
        };
        this.parameters.push(parameter);
        this.parametersByName[name] = parameter;
    }
    /**
   * @param name
   *   The parameter name. This should correspond to a parameter in the SQL,
   *   or a parameter that a called procedure expects.
   *
   * @param type
   *   One of the supported data types.
   *
   * @param value
   *   The value that the parameter is to be given. The Javascript type of the
   *   argument should match that documented for data types
   *
   * @param options
   *   Additional type options. Optional.
   */ addOutputParameter(name, type, value, options) {
        this.addParameter(name, type, value, {
            ...options,
            output: true
        });
    }
    /**
   * @private
   */ makeParamsParameter(parameters) {
        let paramsParameter = '';
        for(let i = 0, len = parameters.length; i < len; i++){
            const parameter = parameters[i];
            if (paramsParameter.length > 0) {
                paramsParameter += ', ';
            }
            paramsParameter += '@' + parameter.name + ' ';
            paramsParameter += parameter.type.declaration(parameter);
            if (parameter.output) {
                paramsParameter += ' OUTPUT';
            }
        }
        return paramsParameter;
    }
    /**
   * @private
   */ validateParameters(collation) {
        for(let i = 0, len = this.parameters.length; i < len; i++){
            const parameter = this.parameters[i];
            try {
                parameter.value = parameter.type.validate(parameter.value, collation);
            } catch (error) {
                throw new _errors.RequestError('Validation failed for parameter \'' + parameter.name + '\'. ' + error.message, 'EPARAM', {
                    cause: error
                });
            }
        }
    }
    /**
   * Temporarily suspends the flow of data from the database. No more `row` events will be emitted until [[resume] is called.
   * If this request is already in a paused state, calling [[pause]] has no effect.
   */ pause() {
        if (this.paused) {
            return;
        }
        this.emit('pause');
        this.paused = true;
    }
    /**
   * Resumes the flow of data from the database.
   * If this request is not in a paused state, calling [[resume]] has no effect.
   */ resume() {
        if (!this.paused) {
            return;
        }
        this.paused = false;
        this.emit('resume');
    }
    /**
   * Cancels a request while waiting for a server response.
   */ cancel() {
        if (this.canceled) {
            return;
        }
        this.canceled = true;
        this.emit('cancel');
    }
    /**
   * Sets a timeout for this request.
   *
   * @param timeout
   *   The number of milliseconds before the request is considered failed,
   *   or `0` for no timeout. When no timeout is set for the request,
   *   the [[ConnectionOptions.requestTimeout]] of the [[Connection]] is used.
   */ setTimeout(timeout) {
        this.timeout = timeout;
    }
}
var _default = exports.default = Request;
module.exports = Request; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRzIiwicmVxdWlyZSIsIl9lcnJvcnMiLCJfdHlwZXMiLCJSZXF1ZXN0IiwiRXZlbnRFbWl0dGVyIiwib24iLCJldmVudCIsImxpc3RlbmVyIiwiZW1pdCIsImFyZ3MiLCJjb25zdHJ1Y3RvciIsInNxbFRleHRPclByb2NlZHVyZSIsImNhbGxiYWNrIiwib3B0aW9ucyIsInBhcmFtZXRlcnMiLCJwYXJhbWV0ZXJzQnlOYW1lIiwicHJlcGFyaW5nIiwiaGFuZGxlIiwidW5kZWZpbmVkIiwiY2FuY2VsZWQiLCJwYXVzZWQiLCJlcnJvciIsImNvbm5lY3Rpb24iLCJ0aW1lb3V0IiwidXNlckNhbGxiYWNrIiwic3RhdGVtZW50Q29sdW1uRW5jcnlwdGlvblNldHRpbmciLCJTUUxTZXJ2ZXJTdGF0ZW1lbnRDb2x1bW5FbmNyeXB0aW9uU2V0dGluZyIsIlVzZUNvbm5lY3Rpb25TZXR0aW5nIiwiY3J5cHRvTWV0YWRhdGFMb2FkZWQiLCJlcnIiLCJyb3dDb3VudCIsInJvd3MiLCJhZGRQYXJhbWV0ZXIiLCJuYW1lIiwidHlwZSIsInZhbHVlIiwib3V0cHV0IiwibGVuZ3RoIiwicHJlY2lzaW9uIiwic2NhbGUiLCJwYXJhbWV0ZXIiLCJwdXNoIiwiYWRkT3V0cHV0UGFyYW1ldGVyIiwibWFrZVBhcmFtc1BhcmFtZXRlciIsInBhcmFtc1BhcmFtZXRlciIsImkiLCJsZW4iLCJkZWNsYXJhdGlvbiIsInZhbGlkYXRlUGFyYW1ldGVycyIsImNvbGxhdGlvbiIsInZhbGlkYXRlIiwiUmVxdWVzdEVycm9yIiwibWVzc2FnZSIsImNhdXNlIiwicGF1c2UiLCJyZXN1bWUiLCJjYW5jZWwiLCJzZXRUaW1lb3V0IiwiX2RlZmF1bHQiLCJleHBvcnRzIiwiZGVmYXVsdCIsIm1vZHVsZSJdLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ2V2ZW50cyc7XG5pbXBvcnQgeyB0eXBlIFBhcmFtZXRlciwgdHlwZSBEYXRhVHlwZSB9IGZyb20gJy4vZGF0YS10eXBlJztcbmltcG9ydCB7IFJlcXVlc3RFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcblxuaW1wb3J0IENvbm5lY3Rpb24gZnJvbSAnLi9jb25uZWN0aW9uJztcbmltcG9ydCB7IHR5cGUgTWV0YWRhdGEgfSBmcm9tICcuL21ldGFkYXRhLXBhcnNlcic7XG5pbXBvcnQgeyBTUUxTZXJ2ZXJTdGF0ZW1lbnRDb2x1bW5FbmNyeXB0aW9uU2V0dGluZyB9IGZyb20gJy4vYWx3YXlzLWVuY3J5cHRlZC90eXBlcyc7XG5pbXBvcnQgeyB0eXBlIENvbHVtbk1ldGFkYXRhIH0gZnJvbSAnLi90b2tlbi9jb2xtZXRhZGF0YS10b2tlbi1wYXJzZXInO1xuaW1wb3J0IHsgQ29sbGF0aW9uIH0gZnJvbSAnLi9jb2xsYXRpb24nO1xuXG4vKipcbiAqIFRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2hlbiB0aGUgcmVxdWVzdCBoYXMgY29tcGxldGVkLCBlaXRoZXIgc3VjY2Vzc2Z1bGx5IG9yIHdpdGggYW4gZXJyb3IuXG4gKiBJZiBhbiBlcnJvciBvY2N1cnMgZHVyaW5nIGV4ZWN1dGlvbiBvZiB0aGUgc3RhdGVtZW50KHMpLCB0aGVuIGBlcnJgIHdpbGwgZGVzY3JpYmUgdGhlIGVycm9yLlxuICpcbiAqIEFzIG9ubHkgb25lIHJlcXVlc3QgYXQgYSB0aW1lIG1heSBiZSBleGVjdXRlZCBvbiBhIGNvbm5lY3Rpb24sIGFub3RoZXIgcmVxdWVzdCBzaG91bGQgbm90XG4gKiBiZSBpbml0aWF0ZWQgdW50aWwgdGhpcyBjYWxsYmFjayBpcyBjYWxsZWQuXG4gKlxuICogVGhpcyBjYWxsYmFjayBpcyBjYWxsZWQgYmVmb3JlIGByZXF1ZXN0Q29tcGxldGVkYCBpcyBlbWl0dGVkLlxuICovXG50eXBlIENvbXBsZXRpb25DYWxsYmFjayA9XG4gIC8qKlxuICAgKiBAcGFyYW0gZXJyb3JcbiAgICogICBJZiBhbiBlcnJvciBvY2N1cnJlZCwgYW4gZXJyb3Igb2JqZWN0LlxuICAgKlxuICAgKiBAcGFyYW0gcm93Q291bnRcbiAgICogICBUaGUgbnVtYmVyIG9mIHJvd3MgZW1pdHRlZCBhcyByZXN1bHQgb2YgZXhlY3V0aW5nIHRoZSBTUUwgc3RhdGVtZW50LlxuICAgKlxuICAgKiBAcGFyYW0gcm93c1xuICAgKiAgIFJvd3MgYXMgYSByZXN1bHQgb2YgZXhlY3V0aW5nIHRoZSBTUUwgc3RhdGVtZW50LlxuICAgKiAgIFdpbGwgb25seSBiZSBhdmFpbGFibGUgaWYgW1tDb25uZWN0aW9uT3B0aW9ucy5yb3dDb2xsZWN0aW9uT25SZXF1ZXN0Q29tcGxldGlvbl1dIGlzIGB0cnVlYC5cbiAgICovXG4gIC8vIFRPRE86IEZpZ3VyZSBvdXQgaG93IHRvIHR5cGUgdGhlIGByb3dzYCBwYXJhbWV0ZXIgaGVyZS5cbiAgKGVycm9yOiBFcnJvciB8IG51bGwgfCB1bmRlZmluZWQsIHJvd0NvdW50PzogbnVtYmVyLCByb3dzPzogYW55KSA9PiB2b2lkO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhcmFtZXRlck9wdGlvbnMge1xuICBvdXRwdXQ/OiBib29sZWFuO1xuICBsZW5ndGg/OiBudW1iZXI7XG4gIHByZWNpc2lvbj86IG51bWJlcjtcbiAgc2NhbGU/OiBudW1iZXI7XG59XG5cbmludGVyZmFjZSBSZXF1ZXN0T3B0aW9ucyB7XG4gIHN0YXRlbWVudENvbHVtbkVuY3J5cHRpb25TZXR0aW5nPzogU1FMU2VydmVyU3RhdGVtZW50Q29sdW1uRW5jcnlwdGlvblNldHRpbmc7XG59XG5cbi8qKlxuICogYGBganNcbiAqIGNvbnN0IHsgUmVxdWVzdCB9ID0gcmVxdWlyZSgndGVkaW91cycpO1xuICogY29uc3QgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KFwic2VsZWN0IDQyLCAnaGVsbG8gd29ybGQnXCIsIChlcnIsIHJvd0NvdW50KSB7XG4gKiAgIC8vIFJlcXVlc3QgY29tcGxldGlvbiBjYWxsYmFjay4uLlxuICogfSk7XG4gKiBjb25uZWN0aW9uLmV4ZWNTcWwocmVxdWVzdCk7XG4gKiBgYGBcbiAqL1xuY2xhc3MgUmVxdWVzdCBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBzcWxUZXh0T3JQcm9jZWR1cmU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHBhcmFtZXRlcnM6IFBhcmFtZXRlcltdO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgcGFyYW1ldGVyc0J5TmFtZTogeyBba2V5OiBzdHJpbmddOiBQYXJhbWV0ZXIgfTtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHByZXBhcmluZzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGNhbmNlbGVkOiBib29sZWFuO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgcGF1c2VkOiBib29sZWFuO1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgdXNlckNhbGxiYWNrOiBDb21wbGV0aW9uQ2FsbGJhY2s7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBoYW5kbGU6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGVycm9yOiBFcnJvciB8IHVuZGVmaW5lZDtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIGNvbm5lY3Rpb246IENvbm5lY3Rpb24gfCB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSB0aW1lb3V0OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHJvd3M/OiBBcnJheTxhbnk+O1xuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGRlY2xhcmUgcnN0PzogQXJyYXk8YW55PjtcbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBkZWNsYXJlIHJvd0NvdW50PzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZGVjbGFyZSBjYWxsYmFjazogQ29tcGxldGlvbkNhbGxiYWNrO1xuXG5cbiAgZGVjbGFyZSBzaG91bGRIb25vckFFPzogYm9vbGVhbjtcbiAgZGVjbGFyZSBzdGF0ZW1lbnRDb2x1bW5FbmNyeXB0aW9uU2V0dGluZzogU1FMU2VydmVyU3RhdGVtZW50Q29sdW1uRW5jcnlwdGlvblNldHRpbmc7XG4gIGRlY2xhcmUgY3J5cHRvTWV0YWRhdGFMb2FkZWQ6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFRoaXMgZXZlbnQsIGRlc2NyaWJpbmcgcmVzdWx0IHNldCBjb2x1bW5zLCB3aWxsIGJlIGVtaXR0ZWQgYmVmb3JlIHJvd1xuICAgKiBldmVudHMgYXJlIGVtaXR0ZWQuIFRoaXMgZXZlbnQgbWF5IGJlIGVtaXR0ZWQgbXVsdGlwbGUgdGltZXMgd2hlbiBtb3JlXG4gICAqIHRoYW4gb25lIHJlY29yZHNldCBpcyBwcm9kdWNlZCBieSB0aGUgc3RhdGVtZW50LlxuICAgKlxuICAgKiBBbiBhcnJheSBsaWtlIG9iamVjdCwgd2hlcmUgdGhlIGNvbHVtbnMgY2FuIGJlIGFjY2Vzc2VkIGVpdGhlciBieSBpbmRleFxuICAgKiBvciBuYW1lLiBDb2x1bW5zIHdpdGggYSBuYW1lIHRoYXQgaXMgYW4gaW50ZWdlciBhcmUgbm90IGFjY2Vzc2libGUgYnkgbmFtZSxcbiAgICogYXMgaXQgd291bGQgYmUgaW50ZXJwcmV0ZWQgYXMgYW4gYXJyYXkgaW5kZXguXG4gICAqL1xuICBvbihcbiAgICBldmVudDogJ2NvbHVtbk1ldGFkYXRhJyxcbiAgICBsaXN0ZW5lcjpcbiAgICAoY29sdW1uczogQ29sdW1uTWV0YWRhdGFbXSB8IHsgW2tleTogc3RyaW5nXTogQ29sdW1uTWV0YWRhdGEgfSkgPT4gdm9pZFxuICApOiB0aGlzXG5cbiAgLyoqXG4gICAqIFRoZSByZXF1ZXN0IGhhcyBiZWVuIHByZXBhcmVkIGFuZCBjYW4gYmUgdXNlZCBpbiBzdWJzZXF1ZW50IGNhbGxzIHRvIGV4ZWN1dGUgYW5kIHVucHJlcGFyZS5cbiAgICovXG4gIG9uKGV2ZW50OiAncHJlcGFyZWQnLCBsaXN0ZW5lcjogKCkgPT4gdm9pZCk6IHRoaXNcblxuICAvKipcbiAgICogVGhlIHJlcXVlc3QgZW5jb3VudGVyZWQgYW4gZXJyb3IgYW5kIGhhcyBub3QgYmVlbiBwcmVwYXJlZC5cbiAgICovXG4gIG9uKGV2ZW50OiAnZXJyb3InLCBsaXN0ZW5lcjogKGVycjogRXJyb3IpID0+IHZvaWQpOiB0aGlzXG5cbiAgLyoqXG4gICAqIEEgcm93IHJlc3VsdGluZyBmcm9tIGV4ZWN1dGlvbiBvZiB0aGUgU1FMIHN0YXRlbWVudC5cbiAgICovXG4gIG9uKFxuICAgIGV2ZW50OiAncm93JyxcbiAgICBsaXN0ZW5lcjpcbiAgICAgIC8qKlxuICAgICAgICogQW4gYXJyYXkgb3Igb2JqZWN0IChkZXBlbmRzIG9uIFtbQ29ubmVjdGlvbk9wdGlvbnMudXNlQ29sdW1uTmFtZXNdXSksIHdoZXJlIHRoZSBjb2x1bW5zIGNhbiBiZSBhY2Nlc3NlZCBieSBpbmRleC9uYW1lLlxuICAgICAgICogRWFjaCBjb2x1bW4gaGFzIHR3byBwcm9wZXJ0aWVzLCBgbWV0YWRhdGFgIGFuZCBgdmFsdWVg77yaXG4gICAgICAgKlxuICAgICAgICogKiBgbWV0YWRhdGFgXG4gICAgICAgKlxuICAgICAgICogICAgVGhlIHNhbWUgZGF0YSB0aGF0IGlzIGV4cG9zZWQgaW4gdGhlIGBjb2x1bW5NZXRhZGF0YWAgZXZlbnQuXG4gICAgICAgKlxuICAgICAgICogKiBgdmFsdWVgXG4gICAgICAgKlxuICAgICAgICogICAgVGhlIGNvbHVtbidzIHZhbHVlLiBJdCB3aWxsIGJlIGBudWxsYCBmb3IgYSBgTlVMTGAuXG4gICAgICAgKiAgICBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgY29sdW1ucyB3aXRoIHRoZSBzYW1lIG5hbWUsIHRoZW4gdGhpcyB3aWxsIGJlIGFuIGFycmF5IG9mIHRoZSB2YWx1ZXMuXG4gICAgICAgKi9cbiAgICAgIChjb2x1bW5zOiBhbnkpID0+IHZvaWRcbiAgKTogdGhpc1xuXG4gIC8qKlxuICAgKiBBbGwgcm93cyBmcm9tIGEgcmVzdWx0IHNldCBoYXZlIGJlZW4gcHJvdmlkZWQgKHRocm91Z2ggYHJvd2AgZXZlbnRzKS5cbiAgICpcbiAgICogVGhpcyB0b2tlbiBpcyB1c2VkIHRvIGluZGljYXRlIHRoZSBjb21wbGV0aW9uIG9mIGEgU1FMIHN0YXRlbWVudC5cbiAgICogQXMgbXVsdGlwbGUgU1FMIHN0YXRlbWVudHMgY2FuIGJlIHNlbnQgdG8gdGhlIHNlcnZlciBpbiBhIHNpbmdsZSBTUUwgYmF0Y2gsIG11bHRpcGxlIGBkb25lYCBjYW4gYmUgZ2VuZXJhdGVkLlxuICAgKiBBbiBgZG9uZWAgZXZlbnQgaXMgZW1pdHRlZCBmb3IgZWFjaCBTUUwgc3RhdGVtZW50IGluIHRoZSBTUUwgYmF0Y2ggZXhjZXB0IHZhcmlhYmxlIGRlY2xhcmF0aW9ucy5cbiAgICogRm9yIGV4ZWN1dGlvbiBvZiBTUUwgc3RhdGVtZW50cyB3aXRoaW4gc3RvcmVkIHByb2NlZHVyZXMsIGBkb25lUHJvY2AgYW5kIGBkb25lSW5Qcm9jYCBldmVudHMgYXJlIHVzZWQgaW4gcGxhY2Ugb2YgYGRvbmVgLlxuICAgKlxuICAgKiBJZiB5b3UgYXJlIHVzaW5nIFtbQ29ubmVjdGlvbi5leGVjU3FsXV0gdGhlbiBTUUwgc2VydmVyIG1heSB0cmVhdCB0aGUgbXVsdGlwbGUgY2FsbHMgd2l0aCB0aGUgc2FtZSBxdWVyeSBhcyBhIHN0b3JlZCBwcm9jZWR1cmUuXG4gICAqIFdoZW4gdGhpcyBvY2N1cnMsIHRoZSBgZG9uZVByb2NgIGFuZCBgZG9uZUluUHJvY2AgZXZlbnRzIG1heSBiZSBlbWl0dGVkIGluc3RlYWQuIFlvdSBtdXN0IGhhbmRsZSBib3RoIGV2ZW50cyB0byBlbnN1cmUgY29tcGxldGUgY292ZXJhZ2UuXG4gICAqL1xuICBvbihcbiAgICBldmVudDogJ2RvbmUnLFxuICAgIGxpc3RlbmVyOlxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0gcm93Q291bnRcbiAgICAgICAqICAgVGhlIG51bWJlciBvZiByZXN1bHQgcm93cy4gTWF5IGJlIGB1bmRlZmluZWRgIGlmIG5vdCBhdmFpbGFibGUuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG1vcmVcbiAgICAgICAqICAgSWYgdGhlcmUgYXJlIG1vcmUgcmVzdWx0cyB0byBjb21lIChwcm9iYWJseSBiZWNhdXNlIG11bHRpcGxlIHN0YXRlbWVudHMgYXJlIGJlaW5nIGV4ZWN1dGVkKSwgdGhlbiBgdHJ1ZWAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHJzdFxuICAgICAgICogICBSb3dzIGFzIGEgcmVzdWx0IG9mIGV4ZWN1dGluZyB0aGUgU1FMIHN0YXRlbWVudC5cbiAgICAgICAqICAgV2lsbCBvbmx5IGJlIGF2YWlsYWJsZSBpZiBDb25uZWN0aW9uJ3MgW1tDb25uZWN0aW9uT3B0aW9ucy5yb3dDb2xsZWN0aW9uT25Eb25lXV0gaXMgYHRydWVgLlxuICAgICAgICovXG4gICAgICAocm93Q291bnQ6IG51bWJlciB8IHVuZGVmaW5lZCwgbW9yZTogYm9vbGVhbiwgcnN0PzogYW55W10pID0+IHZvaWRcbiAgKTogdGhpc1xuXG4gIC8qKlxuICAgKiBgcmVxdWVzdC5vbignZG9uZUluUHJvYycsIGZ1bmN0aW9uIChyb3dDb3VudCwgbW9yZSwgcm93cykgeyB9KTtgXG4gICAqXG4gICAqIEluZGljYXRlcyB0aGUgY29tcGxldGlvbiBzdGF0dXMgb2YgYSBTUUwgc3RhdGVtZW50IHdpdGhpbiBhIHN0b3JlZCBwcm9jZWR1cmUuIEFsbCByb3dzIGZyb20gYSBzdGF0ZW1lbnRcbiAgICogaW4gYSBzdG9yZWQgcHJvY2VkdXJlIGhhdmUgYmVlbiBwcm92aWRlZCAodGhyb3VnaCBgcm93YCBldmVudHMpLlxuICAgKlxuICAgKiBUaGlzIGV2ZW50IG1heSBhbHNvIG9jY3VyIHdoZW4gZXhlY3V0aW5nIG11bHRpcGxlIGNhbGxzIHdpdGggdGhlIHNhbWUgcXVlcnkgdXNpbmcgW1tleGVjU3FsXV0uXG4gICAqL1xuICBvbihcbiAgICBldmVudDogJ2RvbmVJblByb2MnLFxuICAgIGxpc3RlbmVyOlxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0gcm93Q291bnRcbiAgICAgICAqICAgVGhlIG51bWJlciBvZiByZXN1bHQgcm93cy4gTWF5IGJlIGB1bmRlZmluZWRgIGlmIG5vdCBhdmFpbGFibGUuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG1vcmVcbiAgICAgICAqICAgSWYgdGhlcmUgYXJlIG1vcmUgcmVzdWx0cyB0byBjb21lIChwcm9iYWJseSBiZWNhdXNlIG11bHRpcGxlIHN0YXRlbWVudHMgYXJlIGJlaW5nIGV4ZWN1dGVkKSwgdGhlbiBgdHJ1ZWAuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHJzdFxuICAgICAgICogICBSb3dzIGFzIGEgcmVzdWx0IG9mIGV4ZWN1dGluZyB0aGUgU1FMIHN0YXRlbWVudC5cbiAgICAgICAqICAgV2lsbCBvbmx5IGJlIGF2YWlsYWJsZSBpZiBDb25uZWN0aW9uJ3MgW1tDb25uZWN0aW9uT3B0aW9ucy5yb3dDb2xsZWN0aW9uT25Eb25lXV0gaXMgYHRydWVgLlxuICAgICAgICovXG4gICAgICAocm93Q291bnQ6IG51bWJlciB8IHVuZGVmaW5lZCwgbW9yZTogYm9vbGVhbiwgcnN0PzogYW55W10pID0+IHZvaWRcbiAgKTogdGhpc1xuXG4gIC8qKlxuICAgKiBJbmRpY2F0ZXMgdGhlIGNvbXBsZXRpb24gc3RhdHVzIG9mIGEgc3RvcmVkIHByb2NlZHVyZS4gVGhpcyBpcyBhbHNvIGdlbmVyYXRlZCBmb3Igc3RvcmVkIHByb2NlZHVyZXNcbiAgICogZXhlY3V0ZWQgdGhyb3VnaCBTUUwgc3RhdGVtZW50cy5cXFxuICAgKiBUaGlzIGV2ZW50IG1heSBhbHNvIG9jY3VyIHdoZW4gZXhlY3V0aW5nIG11bHRpcGxlIGNhbGxzIHdpdGggdGhlIHNhbWUgcXVlcnkgdXNpbmcgW1tleGVjU3FsXV0uXG4gICAqL1xuICBvbihcbiAgICBldmVudDogJ2RvbmVQcm9jJyxcbiAgICBsaXN0ZW5lcjpcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIHJvd0NvdW50XG4gICAgICAgKiAgIFRoZSBudW1iZXIgb2YgcmVzdWx0IHJvd3MuIE1heSBiZSBgdW5kZWZpbmVkYCBpZiBub3QgYXZhaWxhYmxlLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSBtb3JlXG4gICAgICAgKiAgIElmIHRoZXJlIGFyZSBtb3JlIHJlc3VsdHMgdG8gY29tZSAocHJvYmFibHkgYmVjYXVzZSBtdWx0aXBsZSBzdGF0ZW1lbnRzIGFyZSBiZWluZyBleGVjdXRlZCksIHRoZW4gYHRydWVgLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSByc3RcbiAgICAgICAqICAgUm93cyBhcyBhIHJlc3VsdCBvZiBleGVjdXRpbmcgdGhlIFNRTCBzdGF0ZW1lbnQuXG4gICAgICAgKiAgIFdpbGwgb25seSBiZSBhdmFpbGFibGUgaWYgQ29ubmVjdGlvbidzIFtbQ29ubmVjdGlvbk9wdGlvbnMucm93Q29sbGVjdGlvbk9uRG9uZV1dIGlzIGB0cnVlYC5cbiAgICAgICAqL1xuICAgICAgKHJvd0NvdW50OiBudW1iZXIgfCB1bmRlZmluZWQsIG1vcmU6IGJvb2xlYW4sIHByb2NSZXR1cm5TdGF0dXNWYWx1ZTogbnVtYmVyLCByc3Q/OiBhbnlbXSkgPT4gdm9pZFxuICApOiB0aGlzXG5cbiAgLyoqXG4gICAqIEEgdmFsdWUgZm9yIGFuIG91dHB1dCBwYXJhbWV0ZXIgKHRoYXQgd2FzIGFkZGVkIHRvIHRoZSByZXF1ZXN0IHdpdGggW1thZGRPdXRwdXRQYXJhbWV0ZXJdXSkuXG4gICAqIFNlZSBhbHNvIGBVc2luZyBQYXJhbWV0ZXJzYC5cbiAgICovXG4gIG9uKFxuICAgIGV2ZW50OiAncmV0dXJuVmFsdWUnLFxuICAgIGxpc3RlbmVyOlxuICAgICAgLyoqXG4gICAgICAgKiBAcGFyYW0gcGFyYW1ldGVyTmFtZVxuICAgICAgICogICBUaGUgcGFyYW1ldGVyIG5hbWUuIChEb2VzIG5vdCBzdGFydCB3aXRoICdAJy4pXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHZhbHVlXG4gICAgICAgKiAgIFRoZSBwYXJhbWV0ZXIncyBvdXRwdXQgdmFsdWUuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIG1ldGFkYXRhXG4gICAgICAgKiAgIFRoZSBzYW1lIGRhdGEgdGhhdCBpcyBleHBvc2VkIGluIHRoZSBgY29sdW1uTWV0YURhdGFgIGV2ZW50LlxuICAgICAgICovXG4gICAgICAocGFyYW1ldGVyTmFtZTogc3RyaW5nLCB2YWx1ZTogdW5rbm93biwgbWV0YWRhdGE6IE1ldGFkYXRhKSA9PiB2b2lkXG4gICk6IHRoaXNcblxuICAvKipcbiAgICogVGhpcyBldmVudCBnaXZlcyB0aGUgY29sdW1ucyBieSB3aGljaCBkYXRhIGlzIG9yZGVyZWQsIGlmIGBPUkRFUiBCWWAgY2xhdXNlIGlzIGV4ZWN1dGVkIGluIFNRTCBTZXJ2ZXIuXG4gICAqL1xuICBvbihcbiAgICBldmVudDogJ29yZGVyJyxcbiAgICBsaXN0ZW5lcjpcbiAgICAgIC8qKlxuICAgICAgICogQHBhcmFtIG9yZGVyQ29sdW1uc1xuICAgICAgICogICBBbiBhcnJheSBvZiBjb2x1bW4gbnVtYmVycyBpbiB0aGUgcmVzdWx0IHNldCBieSB3aGljaCBkYXRhIGlzIG9yZGVyZWQuXG4gICAgICAgKi9cbiAgICAgIChvcmRlckNvbHVtbnM6IG51bWJlcltdKSA9PiB2b2lkXG4gICk6IHRoaXNcblxuICBvbihldmVudDogJ3JlcXVlc3RDb21wbGV0ZWQnLCBsaXN0ZW5lcjogKCkgPT4gdm9pZCk6IHRoaXNcblxuICBvbihldmVudDogJ2NhbmNlbCcsIGxpc3RlbmVyOiAoKSA9PiB2b2lkKTogdGhpc1xuXG4gIG9uKGV2ZW50OiAncGF1c2UnLCBsaXN0ZW5lcjogKCkgPT4gdm9pZCk6IHRoaXNcblxuICBvbihldmVudDogJ3Jlc3VtZScsIGxpc3RlbmVyOiAoKSA9PiB2b2lkKTogdGhpc1xuXG4gIG9uKGV2ZW50OiBzdHJpbmcgfCBzeW1ib2wsIGxpc3RlbmVyOiAoLi4uYXJnczogYW55W10pID0+IHZvaWQpIHtcbiAgICByZXR1cm4gc3VwZXIub24oZXZlbnQsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2NvbHVtbk1ldGFkYXRhJywgY29sdW1uczogQ29sdW1uTWV0YWRhdGFbXSB8IHsgW2tleTogc3RyaW5nXTogQ29sdW1uTWV0YWRhdGEgfSk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAncHJlcGFyZWQnKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdlcnJvcicsIGVycjogRXJyb3IpOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ3JvdycsIGNvbHVtbnM6IGFueSk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnZG9uZScsIHJvd0NvdW50OiBudW1iZXIgfCB1bmRlZmluZWQsIG1vcmU6IGJvb2xlYW4sIHJzdD86IGFueVtdKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdkb25lSW5Qcm9jJywgcm93Q291bnQ6IG51bWJlciB8IHVuZGVmaW5lZCwgbW9yZTogYm9vbGVhbiwgcnN0PzogYW55W10pOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2RvbmVQcm9jJywgcm93Q291bnQ6IG51bWJlciB8IHVuZGVmaW5lZCwgbW9yZTogYm9vbGVhbiwgcHJvY1JldHVyblN0YXR1c1ZhbHVlOiBudW1iZXIsIHJzdD86IGFueVtdKTogYm9vbGVhblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGVtaXQoZXZlbnQ6ICdyZXR1cm5WYWx1ZScsIHBhcmFtZXRlck5hbWU6IHN0cmluZywgdmFsdWU6IHVua25vd24sIG1ldGFkYXRhOiBNZXRhZGF0YSk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAncmVxdWVzdENvbXBsZXRlZCcpOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ2NhbmNlbCcpOiBib29sZWFuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgZW1pdChldmVudDogJ3BhdXNlJyk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAncmVzdW1lJyk6IGJvb2xlYW5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBlbWl0KGV2ZW50OiAnb3JkZXInLCBvcmRlckNvbHVtbnM6IG51bWJlcltdKTogYm9vbGVhblxuICBlbWl0KGV2ZW50OiBzdHJpbmcgfCBzeW1ib2wsIC4uLmFyZ3M6IGFueVtdKSB7XG4gICAgcmV0dXJuIHN1cGVyLmVtaXQoZXZlbnQsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBzcWxUZXh0T3JQcm9jZWR1cmVcbiAgICogICBUaGUgU1FMIHN0YXRlbWVudCB0byBiZSBleGVjdXRlZFxuICAgKlxuICAgKiBAcGFyYW0gY2FsbGJhY2tcbiAgICogICBUaGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSBvbmNlIHRoZSByZXF1ZXN0IGhhcyBiZWVuIGZ1bGx5IGNvbXBsZXRlZC5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHNxbFRleHRPclByb2NlZHVyZTogc3RyaW5nIHwgdW5kZWZpbmVkLCBjYWxsYmFjazogQ29tcGxldGlvbkNhbGxiYWNrLCBvcHRpb25zPzogUmVxdWVzdE9wdGlvbnMpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5zcWxUZXh0T3JQcm9jZWR1cmUgPSBzcWxUZXh0T3JQcm9jZWR1cmU7XG4gICAgdGhpcy5wYXJhbWV0ZXJzID0gW107XG4gICAgdGhpcy5wYXJhbWV0ZXJzQnlOYW1lID0ge307XG4gICAgdGhpcy5wcmVwYXJpbmcgPSBmYWxzZTtcbiAgICB0aGlzLmhhbmRsZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmNhbmNlbGVkID0gZmFsc2U7XG4gICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLmVycm9yID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnRpbWVvdXQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy51c2VyQ2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgICB0aGlzLnN0YXRlbWVudENvbHVtbkVuY3J5cHRpb25TZXR0aW5nID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5zdGF0ZW1lbnRDb2x1bW5FbmNyeXB0aW9uU2V0dGluZykgfHwgU1FMU2VydmVyU3RhdGVtZW50Q29sdW1uRW5jcnlwdGlvblNldHRpbmcuVXNlQ29ubmVjdGlvblNldHRpbmc7XG4gICAgdGhpcy5jcnlwdG9NZXRhZGF0YUxvYWRlZCA9IGZhbHNlO1xuICAgIHRoaXMuY2FsbGJhY2sgPSBmdW5jdGlvbihlcnI6IEVycm9yIHwgdW5kZWZpbmVkIHwgbnVsbCwgcm93Q291bnQ/OiBudW1iZXIsIHJvd3M/OiBhbnkpIHtcbiAgICAgIGlmICh0aGlzLnByZXBhcmluZykge1xuICAgICAgICB0aGlzLnByZXBhcmluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsIGVycik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5lbWl0KCdwcmVwYXJlZCcpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnVzZXJDYWxsYmFjayhlcnIsIHJvd0NvdW50LCByb3dzKTtcbiAgICAgICAgdGhpcy5lbWl0KCdyZXF1ZXN0Q29tcGxldGVkJyk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gbmFtZVxuICAgKiAgIFRoZSBwYXJhbWV0ZXIgbmFtZS4gVGhpcyBzaG91bGQgY29ycmVzcG9uZCB0byBhIHBhcmFtZXRlciBpbiB0aGUgU1FMLFxuICAgKiAgIG9yIGEgcGFyYW1ldGVyIHRoYXQgYSBjYWxsZWQgcHJvY2VkdXJlIGV4cGVjdHMuIFRoZSBuYW1lIHNob3VsZCBub3Qgc3RhcnQgd2l0aCBgQGAuXG4gICAqXG4gICAqIEBwYXJhbSB0eXBlXG4gICAqICAgT25lIG9mIHRoZSBzdXBwb3J0ZWQgZGF0YSB0eXBlcy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlXG4gICAqICAgVGhlIHZhbHVlIHRoYXQgdGhlIHBhcmFtZXRlciBpcyB0byBiZSBnaXZlbi4gVGhlIEphdmFzY3JpcHQgdHlwZSBvZiB0aGVcbiAgICogICBhcmd1bWVudCBzaG91bGQgbWF0Y2ggdGhhdCBkb2N1bWVudGVkIGZvciBkYXRhIHR5cGVzLlxuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgKiAgIEFkZGl0aW9uYWwgdHlwZSBvcHRpb25zLiBPcHRpb25hbC5cbiAgICovXG4gIC8vIFRPRE86IGB0eXBlYCBtdXN0IGJlIGEgdmFsaWQgVERTIHZhbHVlIHR5cGVcbiAgYWRkUGFyYW1ldGVyKG5hbWU6IHN0cmluZywgdHlwZTogRGF0YVR5cGUsIHZhbHVlPzogdW5rbm93biwgb3B0aW9ucz86IFJlYWRvbmx5PFBhcmFtZXRlck9wdGlvbnM+IHwgbnVsbCkge1xuICAgIGNvbnN0IHsgb3V0cHV0ID0gZmFsc2UsIGxlbmd0aCwgcHJlY2lzaW9uLCBzY2FsZSB9ID0gb3B0aW9ucyA/PyB7fTtcblxuICAgIGNvbnN0IHBhcmFtZXRlcjogUGFyYW1ldGVyID0ge1xuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIG5hbWU6IG5hbWUsXG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBvdXRwdXQ6IG91dHB1dCxcbiAgICAgIGxlbmd0aDogbGVuZ3RoLFxuICAgICAgcHJlY2lzaW9uOiBwcmVjaXNpb24sXG4gICAgICBzY2FsZTogc2NhbGVcbiAgICB9O1xuXG4gICAgdGhpcy5wYXJhbWV0ZXJzLnB1c2gocGFyYW1ldGVyKTtcbiAgICB0aGlzLnBhcmFtZXRlcnNCeU5hbWVbbmFtZV0gPSBwYXJhbWV0ZXI7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIG5hbWVcbiAgICogICBUaGUgcGFyYW1ldGVyIG5hbWUuIFRoaXMgc2hvdWxkIGNvcnJlc3BvbmQgdG8gYSBwYXJhbWV0ZXIgaW4gdGhlIFNRTCxcbiAgICogICBvciBhIHBhcmFtZXRlciB0aGF0IGEgY2FsbGVkIHByb2NlZHVyZSBleHBlY3RzLlxuICAgKlxuICAgKiBAcGFyYW0gdHlwZVxuICAgKiAgIE9uZSBvZiB0aGUgc3VwcG9ydGVkIGRhdGEgdHlwZXMuXG4gICAqXG4gICAqIEBwYXJhbSB2YWx1ZVxuICAgKiAgIFRoZSB2YWx1ZSB0aGF0IHRoZSBwYXJhbWV0ZXIgaXMgdG8gYmUgZ2l2ZW4uIFRoZSBKYXZhc2NyaXB0IHR5cGUgb2YgdGhlXG4gICAqICAgYXJndW1lbnQgc2hvdWxkIG1hdGNoIHRoYXQgZG9jdW1lbnRlZCBmb3IgZGF0YSB0eXBlc1xuICAgKlxuICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgKiAgIEFkZGl0aW9uYWwgdHlwZSBvcHRpb25zLiBPcHRpb25hbC5cbiAgICovXG4gIGFkZE91dHB1dFBhcmFtZXRlcihuYW1lOiBzdHJpbmcsIHR5cGU6IERhdGFUeXBlLCB2YWx1ZT86IHVua25vd24sIG9wdGlvbnM/OiBSZWFkb25seTxQYXJhbWV0ZXJPcHRpb25zPiB8IG51bGwpIHtcbiAgICB0aGlzLmFkZFBhcmFtZXRlcihuYW1lLCB0eXBlLCB2YWx1ZSwgeyAuLi5vcHRpb25zLCBvdXRwdXQ6IHRydWUgfSk7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIG1ha2VQYXJhbXNQYXJhbWV0ZXIocGFyYW1ldGVyczogUGFyYW1ldGVyW10pIHtcbiAgICBsZXQgcGFyYW1zUGFyYW1ldGVyID0gJyc7XG4gICAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IHBhcmFtZXRlcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IHBhcmFtZXRlciA9IHBhcmFtZXRlcnNbaV07XG4gICAgICBpZiAocGFyYW1zUGFyYW1ldGVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGFyYW1zUGFyYW1ldGVyICs9ICcsICc7XG4gICAgICB9XG4gICAgICBwYXJhbXNQYXJhbWV0ZXIgKz0gJ0AnICsgcGFyYW1ldGVyLm5hbWUgKyAnICc7XG4gICAgICBwYXJhbXNQYXJhbWV0ZXIgKz0gcGFyYW1ldGVyLnR5cGUuZGVjbGFyYXRpb24ocGFyYW1ldGVyKTtcbiAgICAgIGlmIChwYXJhbWV0ZXIub3V0cHV0KSB7XG4gICAgICAgIHBhcmFtc1BhcmFtZXRlciArPSAnIE9VVFBVVCc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJhbXNQYXJhbWV0ZXI7XG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHZhbGlkYXRlUGFyYW1ldGVycyhjb2xsYXRpb246IENvbGxhdGlvbiB8IHVuZGVmaW5lZCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSB0aGlzLnBhcmFtZXRlcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IHBhcmFtZXRlciA9IHRoaXMucGFyYW1ldGVyc1tpXTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcGFyYW1ldGVyLnZhbHVlID0gcGFyYW1ldGVyLnR5cGUudmFsaWRhdGUocGFyYW1ldGVyLnZhbHVlLCBjb2xsYXRpb24pO1xuICAgICAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgICAgICB0aHJvdyBuZXcgUmVxdWVzdEVycm9yKCdWYWxpZGF0aW9uIGZhaWxlZCBmb3IgcGFyYW1ldGVyIFxcJycgKyBwYXJhbWV0ZXIubmFtZSArICdcXCcuICcgKyBlcnJvci5tZXNzYWdlLCAnRVBBUkFNJywgeyBjYXVzZTogZXJyb3IgfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRlbXBvcmFyaWx5IHN1c3BlbmRzIHRoZSBmbG93IG9mIGRhdGEgZnJvbSB0aGUgZGF0YWJhc2UuIE5vIG1vcmUgYHJvd2AgZXZlbnRzIHdpbGwgYmUgZW1pdHRlZCB1bnRpbCBbW3Jlc3VtZV0gaXMgY2FsbGVkLlxuICAgKiBJZiB0aGlzIHJlcXVlc3QgaXMgYWxyZWFkeSBpbiBhIHBhdXNlZCBzdGF0ZSwgY2FsbGluZyBbW3BhdXNlXV0gaGFzIG5vIGVmZmVjdC5cbiAgICovXG4gIHBhdXNlKCkge1xuICAgIGlmICh0aGlzLnBhdXNlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmVtaXQoJ3BhdXNlJyk7XG4gICAgdGhpcy5wYXVzZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc3VtZXMgdGhlIGZsb3cgb2YgZGF0YSBmcm9tIHRoZSBkYXRhYmFzZS5cbiAgICogSWYgdGhpcyByZXF1ZXN0IGlzIG5vdCBpbiBhIHBhdXNlZCBzdGF0ZSwgY2FsbGluZyBbW3Jlc3VtZV1dIGhhcyBubyBlZmZlY3QuXG4gICAqL1xuICByZXN1bWUoKSB7XG4gICAgaWYgKCF0aGlzLnBhdXNlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBhdXNlZCA9IGZhbHNlO1xuICAgIHRoaXMuZW1pdCgncmVzdW1lJyk7XG4gIH1cblxuICAvKipcbiAgICogQ2FuY2VscyBhIHJlcXVlc3Qgd2hpbGUgd2FpdGluZyBmb3IgYSBzZXJ2ZXIgcmVzcG9uc2UuXG4gICAqL1xuICBjYW5jZWwoKSB7XG4gICAgaWYgKHRoaXMuY2FuY2VsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNhbmNlbGVkID0gdHJ1ZTtcbiAgICB0aGlzLmVtaXQoJ2NhbmNlbCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSB0aW1lb3V0IGZvciB0aGlzIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB0aW1lb3V0XG4gICAqICAgVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgYmVmb3JlIHRoZSByZXF1ZXN0IGlzIGNvbnNpZGVyZWQgZmFpbGVkLFxuICAgKiAgIG9yIGAwYCBmb3Igbm8gdGltZW91dC4gV2hlbiBubyB0aW1lb3V0IGlzIHNldCBmb3IgdGhlIHJlcXVlc3QsXG4gICAqICAgdGhlIFtbQ29ubmVjdGlvbk9wdGlvbnMucmVxdWVzdFRpbWVvdXRdXSBvZiB0aGUgW1tDb25uZWN0aW9uXV0gaXMgdXNlZC5cbiAgICovXG4gIHNldFRpbWVvdXQodGltZW91dD86IG51bWJlcikge1xuICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXQ7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVxdWVzdDtcbm1vZHVsZS5leHBvcnRzID0gUmVxdWVzdDtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsT0FBQSxHQUFBQyxPQUFBO0FBRUEsSUFBQUMsT0FBQSxHQUFBRCxPQUFBO0FBSUEsSUFBQUUsTUFBQSxHQUFBRixPQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQTJCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNRyxPQUFPLFNBQVNDLG9CQUFZLENBQUM7RUFDakM7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBRUU7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBRUU7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFFRTtBQUNGO0FBQ0E7O0VBRUU7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFHRTtBQUNGO0FBQ0E7O0VBRUU7QUFDRjtBQUNBOztFQUVFO0FBQ0Y7QUFDQTs7RUFHRTtBQUNGO0FB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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/all-headers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeToTrackingBuffer = writeToTrackingBuffer;
const TYPE = {
    QUERY_NOTIFICATIONS: 1,
    TXN_DESCRIPTOR: 2,
    TRACE_ACTIVITY: 3
};
const TXNDESCRIPTOR_HEADER_DATA_LEN = 4 + 8;
const TXNDESCRIPTOR_HEADER_LEN = 4 + 2 + TXNDESCRIPTOR_HEADER_DATA_LEN;
function writeToTrackingBuffer(buffer, txnDescriptor, outstandingRequestCount) {
    buffer.writeUInt32LE(0);
    buffer.writeUInt32LE(TXNDESCRIPTOR_HEADER_LEN);
    buffer.writeUInt16LE(TYPE.TXN_DESCRIPTOR);
    buffer.writeBuffer(txnDescriptor);
    buffer.writeUInt32LE(outstandingRequestCount);
    const data = buffer.data;
    data.writeUInt32LE(data.length, 0);
    return buffer;
} //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJUWVBFIiwiUVVFUllfTk9USUZJQ0FUSU9OUyIsIlRYTl9ERVNDUklQVE9SIiwiVFJBQ0VfQUNUSVZJVFkiLCJUWE5ERVNDUklQVE9SX0hFQURFUl9EQVRBX0xFTiIsIlRYTkRFU0NSSVBUT1JfSEVBREVSX0xFTiIsIndyaXRlVG9UcmFja2luZ0J1ZmZlciIsImJ1ZmZlciIsInR4bkRlc2NyaXB0b3IiLCJvdXRzdGFuZGluZ1JlcXVlc3RDb3VudCIsIndyaXRlVUludDMyTEUiLCJ3cml0ZVVJbnQxNkxFIiwid3JpdGVCdWZmZXIiLCJkYXRhIiwibGVuZ3RoIl0sInNvdXJjZXMiOlsiLi4vc3JjL2FsbC1oZWFkZXJzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBXcml0YWJsZVRyYWNraW5nQnVmZmVyIGZyb20gJy4vdHJhY2tpbmctYnVmZmVyL3dyaXRhYmxlLXRyYWNraW5nLWJ1ZmZlcic7XG5cbmNvbnN0IFRZUEUgPSB7XG4gIFFVRVJZX05PVElGSUNBVElPTlM6IDEsXG4gIFRYTl9ERVNDUklQVE9SOiAyLFxuICBUUkFDRV9BQ1RJVklUWTogM1xufTtcblxuY29uc3QgVFhOREVTQ1JJUFRPUl9IRUFERVJfREFUQV9MRU4gPSA0ICsgODtcblxuY29uc3QgVFhOREVTQ1JJUFRPUl9IRUFERVJfTEVOID0gNCArIDIgKyBUWE5ERVNDUklQVE9SX0hFQURFUl9EQVRBX0xFTjtcblxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlVG9UcmFja2luZ0J1ZmZlcihidWZmZXI6IFdyaXRhYmxlVHJhY2tpbmdCdWZmZXIsIHR4bkRlc2NyaXB0b3I6IEJ1ZmZlciwgb3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQ6IG51bWJlcikge1xuICBidWZmZXIud3JpdGVVSW50MzJMRSgwKTtcbiAgYnVmZmVyLndyaXRlVUludDMyTEUoVFhOREVTQ1JJUFRPUl9IRUFERVJfTEVOKTtcbiAgYnVmZmVyLndyaXRlVUludDE2TEUoVFlQRS5UWE5fREVTQ1JJUFRPUik7XG4gIGJ1ZmZlci53cml0ZUJ1ZmZlcih0eG5EZXNjcmlwdG9yKTtcbiAgYnVmZmVyLndyaXRlVUludDMyTEUob3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQpO1xuXG4gIGNvbnN0IGRhdGEgPSBidWZmZXIuZGF0YTtcbiAgZGF0YS53cml0ZVVJbnQzMkxFKGRhdGEubGVuZ3RoLCAwKTtcbiAgcmV0dXJuIGJ1ZmZlcjtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUEsTUFBTUEsSUFBSSxHQUFHO0VBQ1hDLG1CQUFtQixFQUFFLENBQUM7RUFDdEJDLGNBQWMsRUFBRSxDQUFDO0VBQ2pCQyxjQUFjLEVBQUU7QUFDbEIsQ0FBQztBQUVELE1BQU1DLDZCQUE2QixHQUFHLENBQUMsR0FBRyxDQUFDO0FBRTNDLE1BQU1DLHdCQUF3QixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUdELDZCQUE2QjtBQUUvRCxTQUFTRSxxQkFBcUJBLENBQUNDLE1BQThCLEVBQUVDLGFBQXFCLEVBQUVDLHVCQUErQixFQUFFO0VBQzVIRixNQUFNLENBQUNHLGFBQWEsQ0FBQyxDQUFDLENBQUM7RUFDdkJILE1BQU0sQ0FBQ0csYUFBYSxDQUFDTCx3QkFBd0IsQ0FBQztFQUM5Q0UsTUFBTSxDQUFDSSxhQUFhLENBQUNYLElBQUksQ0FBQ0UsY0FBYyxDQUFDO0VBQ3pDSyxNQUFNLENBQUNLLFdBQVcsQ0FBQ0osYUFBYSxDQUFDO0VBQ2pDRCxNQUFNLENBQUNHLGFBQWEsQ0FBQ0QsdUJBQXVCLENBQUM7RUFFN0MsTUFBTUksSUFBSSxHQUFHTixNQUFNLENBQUNNLElBQUk7RUFDeEJBLElBQUksQ0FBQ0gsYUFBYSxDQUFDRyxJQUFJLENBQUNDLE1BQU0sRUFBRSxDQUFDLENBQUM7RUFDbEMsT0FBT1AsTUFBTTtBQUNmIiwiaWdub3JlTGlzdCI6W119
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/rpcrequest-payload.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _writableTrackingBuffer = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tracking-buffer/writable-tracking-buffer.js [app-route] (ecmascript)"));
var _allHeaders = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/all-headers.js [app-route] (ecmascript)");
var _errors = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/errors.js [app-route] (ecmascript)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
// const OPTION = {
//   WITH_RECOMPILE: 0x01,
//   NO_METADATA: 0x02,
//   REUSE_METADATA: 0x04
// };
const STATUS = {
    BY_REF_VALUE: 0x01,
    DEFAULT_VALUE: 0x02
};
/*
  s2.2.6.5
 */ class RpcRequestPayload {
    constructor(procedure, parameters, txnDescriptor, options, collation){
        this.procedure = procedure;
        this.parameters = parameters;
        this.options = options;
        this.txnDescriptor = txnDescriptor;
        this.collation = collation;
    }
    [Symbol.iterator]() {
        return this.generateData();
    }
    *generateData() {
        const buffer = new _writableTrackingBuffer.default(500);
        if (this.options.tdsVersion >= '7_2') {
            const outstandingRequestCount = 1;
            (0, _allHeaders.writeToTrackingBuffer)(buffer, this.txnDescriptor, outstandingRequestCount);
        }
        if (typeof this.procedure === 'string') {
            buffer.writeUsVarchar(this.procedure);
        } else {
            buffer.writeUShort(0xFFFF);
            buffer.writeUShort(this.procedure);
        }
        const optionFlags = 0;
        buffer.writeUInt16LE(optionFlags);
        yield buffer.data;
        const parametersLength = this.parameters.length;
        for(let i = 0; i < parametersLength; i++){
            yield* this.generateParameterData(this.parameters[i]);
        }
    }
    toString(indent = '') {
        return indent + ('RPC Request - ' + this.procedure);
    }
    *generateParameterData(parameter) {
        const buffer = new _writableTrackingBuffer.default(1 + 2 + Buffer.byteLength(parameter.name, 'ucs-2') + 1);
        if (parameter.name) {
            buffer.writeBVarchar('@' + parameter.name);
        } else {
            buffer.writeBVarchar('');
        }
        let statusFlags = 0;
        if (parameter.output) {
            statusFlags |= STATUS.BY_REF_VALUE;
        }
        buffer.writeUInt8(statusFlags);
        yield buffer.data;
        const param = {
            value: parameter.value
        };
        const type = parameter.type;
        if ((type.id & 0x30) === 0x20) {
            if (parameter.length) {
                param.length = parameter.length;
            } else if (type.resolveLength) {
                param.length = type.resolveLength(parameter);
            }
        }
        if (parameter.precision) {
            param.precision = parameter.precision;
        } else if (type.resolvePrecision) {
            param.precision = type.resolvePrecision(parameter);
        }
        if (parameter.scale) {
            param.scale = parameter.scale;
        } else if (type.resolveScale) {
            param.scale = type.resolveScale(parameter);
        }
        if (this.collation) {
            param.collation = this.collation;
        }
        yield type.generateTypeInfo(param, this.options);
        yield type.generateParameterLength(param, this.options);
        try {
            yield* type.generateParameterData(param, this.options);
        } catch (error) {
            throw new _errors.InputError(`Input parameter '${parameter.name}' could not be validated`, {
                cause: error
            });
        }
    }
}
var _default = exports.default = RpcRequestPayload;
module.exports = RpcRequestPayload; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfd3JpdGFibGVUcmFja2luZ0J1ZmZlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2FsbEhlYWRlcnMiLCJfZXJyb3JzIiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiU1RBVFVTIiwiQllfUkVGX1ZBTFVFIiwiREVGQVVMVF9WQUxVRSIsIlJwY1JlcXVlc3RQYXlsb2FkIiwiY29uc3RydWN0b3IiLCJwcm9jZWR1cmUiLCJwYXJhbWV0ZXJzIiwidHhuRGVzY3JpcHRvciIsIm9wdGlvbnMiLCJjb2xsYXRpb24iLCJTeW1ib2wiLCJpdGVyYXRvciIsImdlbmVyYXRlRGF0YSIsImJ1ZmZlciIsIldyaXRhYmxlVHJhY2tpbmdCdWZmZXIiLCJ0ZHNWZXJzaW9uIiwib3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQiLCJ3cml0ZVRvVHJhY2tpbmdCdWZmZXIiLCJ3cml0ZVVzVmFyY2hhciIsIndyaXRlVVNob3J0Iiwib3B0aW9uRmxhZ3MiLCJ3cml0ZVVJbnQxNkxFIiwiZGF0YSIsInBhcmFtZXRlcnNMZW5ndGgiLCJsZW5ndGgiLCJpIiwiZ2VuZXJhdGVQYXJhbWV0ZXJEYXRhIiwidG9TdHJpbmciLCJpbmRlbnQiLCJwYXJhbWV0ZXIiLCJCdWZmZXIiLCJieXRlTGVuZ3RoIiwibmFtZSIsIndyaXRlQlZhcmNoYXIiLCJzdGF0dXNGbGFncyIsIm91dHB1dCIsIndyaXRlVUludDgiLCJwYXJhbSIsInZhbHVlIiwidHlwZSIsImlkIiwicmVzb2x2ZUxlbmd0aCIsInByZWNpc2lvbiIsInJlc29sdmVQcmVjaXNpb24iLCJzY2FsZSIsInJlc29sdmVTY2FsZSIsImdlbmVyYXRlVHlwZUluZm8iLCJnZW5lcmF0ZVBhcmFtZXRlckxlbmd0aCIsImVycm9yIiwiSW5wdXRFcnJvciIsImNhdXNlIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIl0sInNvdXJjZXMiOlsiLi4vc3JjL3JwY3JlcXVlc3QtcGF5bG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgV3JpdGFibGVUcmFja2luZ0J1ZmZlciBmcm9tICcuL3RyYWNraW5nLWJ1ZmZlci93cml0YWJsZS10cmFja2luZy1idWZmZXInO1xuaW1wb3J0IHsgd3JpdGVUb1RyYWNraW5nQnVmZmVyIH0gZnJvbSAnLi9hbGwtaGVhZGVycyc7XG5pbXBvcnQgeyB0eXBlIFBhcmFtZXRlciwgdHlwZSBQYXJhbWV0ZXJEYXRhIH0gZnJvbSAnLi9kYXRhLXR5cGUnO1xuaW1wb3J0IHsgdHlwZSBJbnRlcm5hbENvbm5lY3Rpb25PcHRpb25zIH0gZnJvbSAnLi9jb25uZWN0aW9uJztcbmltcG9ydCB7IENvbGxhdGlvbiB9IGZyb20gJy4vY29sbGF0aW9uJztcbmltcG9ydCB7IElucHV0RXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XG5cbi8vIGNvbnN0IE9QVElPTiA9IHtcbi8vICAgV0lUSF9SRUNPTVBJTEU6IDB4MDEsXG4vLyAgIE5PX01FVEFEQVRBOiAweDAyLFxuLy8gICBSRVVTRV9NRVRBREFUQTogMHgwNFxuLy8gfTtcblxuY29uc3QgU1RBVFVTID0ge1xuICBCWV9SRUZfVkFMVUU6IDB4MDEsXG4gIERFRkFVTFRfVkFMVUU6IDB4MDJcbn07XG5cbi8qXG4gIHMyLjIuNi41XG4gKi9cbmNsYXNzIFJwY1JlcXVlc3RQYXlsb2FkIGltcGxlbWVudHMgSXRlcmFibGU8QnVmZmVyPiB7XG4gIGRlY2xhcmUgcHJvY2VkdXJlOiBzdHJpbmcgfCBudW1iZXI7XG4gIGRlY2xhcmUgcGFyYW1ldGVyczogUGFyYW1ldGVyW107XG5cbiAgZGVjbGFyZSBvcHRpb25zOiBJbnRlcm5hbENvbm5lY3Rpb25PcHRpb25zO1xuICBkZWNsYXJlIHR4bkRlc2NyaXB0b3I6IEJ1ZmZlcjtcbiAgZGVjbGFyZSBjb2xsYXRpb246IENvbGxhdGlvbiB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3Rvcihwcm9jZWR1cmU6IHN0cmluZyB8IG51bWJlciwgcGFyYW1ldGVyczogUGFyYW1ldGVyW10sIHR4bkRlc2NyaXB0b3I6IEJ1ZmZlciwgb3B0aW9uczogSW50ZXJuYWxDb25uZWN0aW9uT3B0aW9ucywgY29sbGF0aW9uOiBDb2xsYXRpb24gfCB1bmRlZmluZWQpIHtcbiAgICB0aGlzLnByb2NlZHVyZSA9IHByb2NlZHVyZTtcbiAgICB0aGlzLnBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJzO1xuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgdGhpcy50eG5EZXNjcmlwdG9yID0gdHhuRGVzY3JpcHRvcjtcbiAgICB0aGlzLmNvbGxhdGlvbiA9IGNvbGxhdGlvbjtcbiAgfVxuXG4gIFtTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzLmdlbmVyYXRlRGF0YSgpO1xuICB9XG5cbiAgKiBnZW5lcmF0ZURhdGEoKSB7XG4gICAgY29uc3QgYnVmZmVyID0gbmV3IFdyaXRhYmxlVHJhY2tpbmdCdWZmZXIoNTAwKTtcbiAgICBpZiAodGhpcy5vcHRpb25zLnRkc1ZlcnNpb24gPj0gJzdfMicpIHtcbiAgICAgIGNvbnN0IG91dHN0YW5kaW5nUmVxdWVzdENvdW50ID0gMTtcbiAgICAgIHdyaXRlVG9UcmFja2luZ0J1ZmZlcihidWZmZXIsIHRoaXMudHhuRGVzY3JpcHRvciwgb3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5wcm9jZWR1cmUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBidWZmZXIud3JpdGVVc1ZhcmNoYXIodGhpcy5wcm9jZWR1cmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBidWZmZXIud3JpdGVVU2hvcnQoMHhGRkZGKTtcbiAgICAgIGJ1ZmZlci53cml0ZVVTaG9ydCh0aGlzLnByb2NlZHVyZSk7XG4gICAgfVxuXG4gICAgY29uc3Qgb3B0aW9uRmxhZ3MgPSAwO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQxNkxFKG9wdGlvbkZsYWdzKTtcbiAgICB5aWVsZCBidWZmZXIuZGF0YTtcblxuICAgIGNvbnN0IHBhcmFtZXRlcnNMZW5ndGggPSB0aGlzLnBhcmFtZXRlcnMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcGFyYW1ldGVyc0xlbmd0aDsgaSsrKSB7XG4gICAgICB5aWVsZCAqIHRoaXMuZ2VuZXJhdGVQYXJhbWV0ZXJEYXRhKHRoaXMucGFyYW1ldGVyc1tpXSk7XG4gICAgfVxuICB9XG5cbiAgdG9TdHJpbmcoaW5kZW50ID0gJycpIHtcbiAgICByZXR1cm4gaW5kZW50ICsgKCdSUEMgUmVxdWVzdCAtICcgKyB0aGlzLnByb2NlZHVyZSk7XG4gIH1cblxuICAqIGdlbmVyYXRlUGFyYW1ldGVyRGF0YShwYXJhbWV0ZXI6IFBhcmFtZXRlcikge1xuICAgIGNvbnN0IGJ1ZmZlciA9IG5ldyBXcml0YWJsZVRyYWNraW5nQnVmZmVyKDEgKyAyICsgQnVmZmVyLmJ5dGVMZW5ndGgocGFyYW1ldGVyLm5hbWUsICd1Y3MtMicpICsgMSk7XG5cbiAgICBpZiAocGFyYW1ldGVyLm5hbWUpIHtcbiAgICAgIGJ1ZmZlci53cml0ZUJWYXJjaGFyKCdAJyArIHBhcmFtZXRlci5uYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmZmVyLndyaXRlQlZhcmNoYXIoJycpO1xuICAgIH1cblxuICAgIGxldCBzdGF0dXNGbGFncyA9IDA7XG4gICAgaWYgKHBhcmFtZXRlci5vdXRwdXQpIHtcbiAgICAgIHN0YXR1c0ZsYWdzIHw9IFNUQVRVUy5CWV9SRUZfVkFMVUU7XG4gICAgfVxuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KHN0YXR1c0ZsYWdzKTtcblxuICAgIHlpZWxkIGJ1ZmZlci5kYXRhO1xuXG4gICAgY29uc3QgcGFyYW06IFBhcmFtZXRlckRhdGEgPSB7IHZhbHVlOiBwYXJhbWV0ZXIudmFsdWUgfTtcblxuICAgIGNvbnN0IHR5cGUgPSBwYXJhbWV0ZXIudHlwZTtcblxuICAgIGlmICgodHlwZS5pZCAmIDB4MzApID09PSAweDIwKSB7XG4gICAgICBpZiAocGFyYW1ldGVyLmxlbmd0aCkge1xuICAgICAgICBwYXJhbS5sZW5ndGggPSBwYXJhbWV0ZXIubGVuZ3RoO1xuICAgICAgfSBlbHNlIGlmICh0eXBlLnJlc29sdmVMZW5ndGgpIHtcbiAgICAgICAgcGFyYW0ubGVuZ3RoID0gdHlwZS5yZXNvbHZlTGVuZ3RoKHBhcmFtZXRlcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBhcmFtZXRlci5wcmVjaXNpb24pIHtcbiAgICAgIHBhcmFtLnByZWNpc2lvbiA9IHBhcmFtZXRlci5wcmVjaXNpb247XG4gICAgfSBlbHNlIGlmICh0eXBlLnJlc29sdmVQcmVjaXNpb24pIHtcbiAgICAgIHBhcmFtLnByZWNpc2lvbiA9IHR5cGUucmVzb2x2ZVByZWNpc2lvbihwYXJhbWV0ZXIpO1xuICAgIH1cblxuICAgIGlmIChwYXJhbWV0ZXIuc2NhbGUpIHtcbiAgICAgIHBhcmFtLnNjYWxlID0gcGFyYW1ldGVyLnNjYWxlO1xuICAgIH0gZWxzZSBpZiAodHlwZS5yZXNvbHZlU2NhbGUpIHtcbiAgICAgIHBhcmFtLnNjYWxlID0gdHlwZS5yZXNvbHZlU2NhbGUocGFyYW1ldGVyKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb2xsYXRpb24pIHtcbiAgICAgIHBhcmFtLmNvbGxhdGlvbiA9IHRoaXMuY29sbGF0aW9uO1xuICAgIH1cblxuICAgIHlpZWxkIHR5cGUuZ2VuZXJhdGVUeXBlSW5mbyhwYXJhbSwgdGhpcy5vcHRpb25zKTtcbiAgICB5aWVsZCB0eXBlLmdlbmVyYXRlUGFyYW1ldGVyTGVuZ3RoKHBhcmFtLCB0aGlzLm9wdGlvbnMpO1xuICAgIHRyeSB7XG4gICAgICB5aWVsZCAqIHR5cGUuZ2VuZXJhdGVQYXJhbWV0ZXJEYXRhKHBhcmFtLCB0aGlzLm9wdGlvbnMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICB0aHJvdyBuZXcgSW5wdXRFcnJvcihgSW5wdXQgcGFyYW1ldGVyICcke3BhcmFtZXRlci5uYW1lfScgY291bGQgbm90IGJlIHZhbGlkYXRlZGAsIHsgY2F1c2U6IGVycm9yIH0pO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBScGNSZXF1ZXN0UGF5bG9hZDtcbm1vZHVsZS5leHBvcnRzID0gUnBjUmVxdWVzdFBheWxvYWQ7XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLHVCQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxXQUFBLEdBQUFELE9BQUE7QUFJQSxJQUFBRSxPQUFBLEdBQUFGLE9BQUE7QUFBc0MsU0FBQUQsdUJBQUFJLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxLQUFBRSxPQUFBLEVBQUFGLENBQUE7QUFFdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNRyxNQUFNLEdBQUc7RUFDYkMsWUFBWSxFQUFFLElBQUk7RUFDbEJDLGFBQWEsRUFBRTtBQUNqQixDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLE1BQU1DLGlCQUFpQixDQUE2QjtFQVFsREMsV0FBV0EsQ0FBQ0MsU0FBMEIsRUFBRUMsVUFBdUIsRUFBRUMsYUFBcUIsRUFBRUMsT0FBa0MsRUFBRUMsU0FBZ0MsRUFBRTtJQUM1SixJQUFJLENBQUNKLFNBQVMsR0FBR0EsU0FBUztJQUMxQixJQUFJLENBQUNDLFVBQVUsR0FBR0EsVUFBVTtJQUM1QixJQUFJLENBQUNFLE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUNELGFBQWEsR0FBR0EsYUFBYTtJQUNsQyxJQUFJLENBQUNFLFNBQVMsR0FBR0EsU0FBUztFQUM1QjtFQUVBLENBQUNDLE1BQU0sQ0FBQ0MsUUFBUSxJQUFJO0lBQ2xCLE9BQU8sSUFBSSxDQUFDQyxZQUFZLENBQUMsQ0FBQztFQUM1QjtFQUVBLENBQUVBLFlBQVlBLENBQUEsRUFBRztJQUNmLE1BQU1DLE1BQU0sR0FBRyxJQUFJQywrQkFBc0IsQ0FBQyxHQUFHLENBQUM7SUFDOUMsSUFBSSxJQUFJLENBQUNOLE9BQU8sQ0FBQ08sVUFBVSxJQUFJLEtBQUssRUFBRTtNQUNwQyxNQUFNQyx1QkFBdUIsR0FBRyxDQUFDO01BQ2pDLElBQUFD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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/sqlbatch-payload.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _writableTrackingBuffer = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tracking-buffer/writable-tracking-buffer.js [app-route] (ecmascript)"));
var _allHeaders = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/all-headers.js [app-route] (ecmascript)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
/*
  s2.2.6.6
 */ class SqlBatchPayload {
    constructor(sqlText, txnDescriptor, options){
        this.sqlText = sqlText;
        this.txnDescriptor = txnDescriptor;
        this.options = options;
    }
    *[Symbol.iterator]() {
        if (this.options.tdsVersion >= '7_2') {
            const buffer = new _writableTrackingBuffer.default(18, 'ucs2');
            const outstandingRequestCount = 1;
            (0, _allHeaders.writeToTrackingBuffer)(buffer, this.txnDescriptor, outstandingRequestCount);
            yield buffer.data;
        }
        yield Buffer.from(this.sqlText, 'ucs2');
    }
    toString(indent = '') {
        return indent + ('SQL Batch - ' + this.sqlText);
    }
}
var _default = exports.default = SqlBatchPayload;
module.exports = SqlBatchPayload; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfd3JpdGFibGVUcmFja2luZ0J1ZmZlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2FsbEhlYWRlcnMiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJTcWxCYXRjaFBheWxvYWQiLCJjb25zdHJ1Y3RvciIsInNxbFRleHQiLCJ0eG5EZXNjcmlwdG9yIiwib3B0aW9ucyIsIlN5bWJvbCIsIml0ZXJhdG9yIiwidGRzVmVyc2lvbiIsImJ1ZmZlciIsIldyaXRhYmxlVHJhY2tpbmdCdWZmZXIiLCJvdXRzdGFuZGluZ1JlcXVlc3RDb3VudCIsIndyaXRlVG9UcmFja2luZ0J1ZmZlciIsImRhdGEiLCJCdWZmZXIiLCJmcm9tIiwidG9TdHJpbmciLCJpbmRlbnQiLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiXSwic291cmNlcyI6WyIuLi9zcmMvc3FsYmF0Y2gtcGF5bG9hZC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgV3JpdGFibGVUcmFja2luZ0J1ZmZlciBmcm9tICcuL3RyYWNraW5nLWJ1ZmZlci93cml0YWJsZS10cmFja2luZy1idWZmZXInO1xuaW1wb3J0IHsgd3JpdGVUb1RyYWNraW5nQnVmZmVyIH0gZnJvbSAnLi9hbGwtaGVhZGVycyc7XG5cbi8qXG4gIHMyLjIuNi42XG4gKi9cbmNsYXNzIFNxbEJhdGNoUGF5bG9hZCBpbXBsZW1lbnRzIEl0ZXJhYmxlPEJ1ZmZlcj4ge1xuICBkZWNsYXJlIHNxbFRleHQ6IHN0cmluZztcbiAgZGVjbGFyZSB0eG5EZXNjcmlwdG9yOiBCdWZmZXI7XG4gIGRlY2xhcmUgb3B0aW9uczogeyB0ZHNWZXJzaW9uOiBzdHJpbmcgfTtcblxuICBjb25zdHJ1Y3RvcihzcWxUZXh0OiBzdHJpbmcsIHR4bkRlc2NyaXB0b3I6IEJ1ZmZlciwgb3B0aW9uczogeyB0ZHNWZXJzaW9uOiBzdHJpbmcgfSkge1xuICAgIHRoaXMuc3FsVGV4dCA9IHNxbFRleHQ7XG4gICAgdGhpcy50eG5EZXNjcmlwdG9yID0gdHhuRGVzY3JpcHRvcjtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICB9XG5cbiAgKltTeW1ib2wuaXRlcmF0b3JdKCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMudGRzVmVyc2lvbiA+PSAnN18yJykge1xuICAgICAgY29uc3QgYnVmZmVyID0gbmV3IFdyaXRhYmxlVHJhY2tpbmdCdWZmZXIoMTgsICd1Y3MyJyk7XG4gICAgICBjb25zdCBvdXRzdGFuZGluZ1JlcXVlc3RDb3VudCA9IDE7XG5cbiAgICAgIHdyaXRlVG9UcmFja2luZ0J1ZmZlcihidWZmZXIsIHRoaXMudHhuRGVzY3JpcHRvciwgb3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQpO1xuXG4gICAgICB5aWVsZCBidWZmZXIuZGF0YTtcbiAgICB9XG5cbiAgICB5aWVsZCBCdWZmZXIuZnJvbSh0aGlzLnNxbFRleHQsICd1Y3MyJyk7XG4gIH1cblxuICB0b1N0cmluZyhpbmRlbnQgPSAnJykge1xuICAgIHJldHVybiBpbmRlbnQgKyAoJ1NRTCBCYXRjaCAtICcgKyB0aGlzLnNxbFRleHQpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNxbEJhdGNoUGF5bG9hZDtcbm1vZHVsZS5leHBvcnRzID0gU3FsQmF0Y2hQYXlsb2FkO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSx1QkFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsV0FBQSxHQUFBRCxPQUFBO0FBQXNELFNBQUFELHVCQUFBRyxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBRXREO0FBQ0E7QUFDQTtBQUNBLE1BQU1HLGVBQWUsQ0FBNkI7RUFLaERDLFdBQVdBLENBQUNDLE9BQWUsRUFBRUMsYUFBcUIsRUFBRUMsT0FBK0IsRUFBRTtJQUNuRixJQUFJLENBQUNGLE9BQU8sR0FBR0EsT0FBTztJQUN0QixJQUFJLENBQUNDLGFBQWEsR0FBR0EsYUFBYTtJQUNsQyxJQUFJLENBQUNDLE9BQU8sR0FBR0EsT0FBTztFQUN4QjtFQUVBLEVBQUVDLE1BQU0sQ0FBQ0MsUUFBUSxJQUFJO0lBQ25CLElBQUksSUFBSSxDQUFDRixPQUFPLENBQUNHLFVBQVUsSUFBSSxLQUFLLEVBQUU7TUFDcEMsTUFBTUMsTUFBTSxHQUFHLElBQUlDLCtCQUFzQixDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUM7TUFDckQsTUFBTUMsdUJBQXVCLEdBQUcsQ0FBQztNQUVqQyxJQUFBQyxpQ0FBcUIsRUFBQ0gsTUFBTSxFQUFFLElBQUksQ0FBQ0wsYUFBYSxFQUFFTyx1QkFBdUIsQ0FBQztNQUUxRSxNQUFNRixNQUFNLENBQUNJLElBQUk7SUFDbkI7SUFFQSxNQUFNQyxNQUFNLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUNaLE9BQU8sRUFBRSxNQUFNLENBQUM7RUFDekM7RUFFQWEsUUFBUUEsQ0FBQ0MsTUFBTSxHQUFHLEVBQUUsRUFBRTtJQUNwQixPQUFPQSxNQUFNLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQ2QsT0FBTyxDQUFDO0VBQ2pEO0FBQ0Y7QUFBQyxJQUFBZSxRQUFBLEdBQUFDLE9BQUEsQ0FBQW5CLE9BQUEsR0FFY0MsZUFBZTtBQUM5Qm1CLE1BQU0sQ0FBQ0QsT0FBTyxHQUFHbEIsZUFBZSIsImlnbm9yZUxpc3QiOltdfQ==
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/message.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
class Message extends _stream.PassThrough {
    constructor({ type, resetConnection = false }){
        super();
        this.type = type;
        this.resetConnection = resetConnection;
        this.ignore = false;
    }
}
var _default = exports.default = Message;
module.exports = Message; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfc3RyZWFtIiwicmVxdWlyZSIsIk1lc3NhZ2UiLCJQYXNzVGhyb3VnaCIsImNvbnN0cnVjdG9yIiwidHlwZSIsInJlc2V0Q29ubmVjdGlvbiIsImlnbm9yZSIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsImRlZmF1bHQiLCJtb2R1bGUiXSwic291cmNlcyI6WyIuLi9zcmMvbWVzc2FnZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQYXNzVGhyb3VnaCB9IGZyb20gJ3N0cmVhbSc7XG5cbmNsYXNzIE1lc3NhZ2UgZXh0ZW5kcyBQYXNzVGhyb3VnaCB7XG4gIGRlY2xhcmUgdHlwZTogbnVtYmVyO1xuICBkZWNsYXJlIHJlc2V0Q29ubmVjdGlvbjogYm9vbGVhbjtcbiAgZGVjbGFyZSBpZ25vcmU6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoeyB0eXBlLCByZXNldENvbm5lY3Rpb24gPSBmYWxzZSB9OiB7IHR5cGU6IG51bWJlciwgcmVzZXRDb25uZWN0aW9uPzogYm9vbGVhbiB8IHVuZGVmaW5lZCB9KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgdGhpcy5yZXNldENvbm5lY3Rpb24gPSByZXNldENvbm5lY3Rpb247XG4gICAgdGhpcy5pZ25vcmUgPSBmYWxzZTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNZXNzYWdlO1xubW9kdWxlLmV4cG9ydHMgPSBNZXNzYWdlO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxPQUFBLEdBQUFDLE9BQUE7QUFFQSxNQUFNQyxPQUFPLFNBQVNDLG1CQUFXLENBQUM7RUFLaENDLFdBQVdBLENBQUM7SUFBRUMsSUFBSTtJQUFFQyxlQUFlLEdBQUc7RUFBK0QsQ0FBQyxFQUFFO0lBQ3RHLEtBQUssQ0FBQyxDQUFDO0lBRVAsSUFBSSxDQUFDRCxJQUFJLEdBQUdBLElBQUk7SUFDaEIsSUFBSSxDQUFDQyxlQUFlLEdBQUdBLGVBQWU7SUFDdEMsSUFBSSxDQUFDQyxNQUFNLEdBQUcsS0FBSztFQUNyQjtBQUNGO0FBQUMsSUFBQUMsUUFBQSxHQUFBQyxPQUFBLENBQUFDLE9BQUEsR0FFY1IsT0FBTztBQUN0QlMsTUFBTSxDQUFDRixPQUFPLEdBQUdQLE9BQU8iLCJpZ25vcmVMaXN0IjpbXX0=
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/incoming-message-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _bl = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/bl@6.1.6/node_modules/bl/bl.js [app-route] (ecmascript)"));
var _stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var _message = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/message.js [app-route] (ecmascript)"));
var _packet = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/packet.js [app-route] (ecmascript)");
var _errors = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/errors.js [app-route] (ecmascript)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
/**
  IncomingMessageStream
  Transform received TDS data into individual IncomingMessage streams.
*/ class IncomingMessageStream extends _stream.Transform {
    constructor(debug){
        super({
            readableObjectMode: true
        });
        this.debug = debug;
        this.currentMessage = undefined;
        this.bl = new _bl.default();
    }
    pause() {
        super.pause();
        if (this.currentMessage) {
            this.currentMessage.pause();
        }
        return this;
    }
    resume() {
        super.resume();
        if (this.currentMessage) {
            this.currentMessage.resume();
        }
        return this;
    }
    processBufferedData(callback) {
        // The packet header is always 8 bytes of length.
        while(this.bl.length >= _packet.HEADER_LENGTH){
            // Get the full packet length
            const length = this.bl.readUInt16BE(2);
            if (length < _packet.HEADER_LENGTH) {
                return callback(new _errors.ConnectionError('Unable to process incoming packet'));
            }
            if (this.bl.length >= length) {
                const data = this.bl.slice(0, length);
                this.bl.consume(length);
                // TODO: Get rid of creating `Packet` instances here.
                const packet = new _packet.Packet(data);
                this.debug.packet('Received', packet);
                this.debug.data(packet);
                let message = this.currentMessage;
                if (message === undefined) {
                    this.currentMessage = message = new _message.default({
                        type: packet.type(),
                        resetConnection: false
                    });
                    this.push(message);
                }
                if (packet.isLast()) {
                    // Wait until the current message was fully processed before we
                    // continue processing any remaining messages.
                    message.once('end', ()=>{
                        this.currentMessage = undefined;
                        this.processBufferedData(callback);
                    });
                    message.end(packet.data());
                    return;
                } else if (!message.write(packet.data())) {
                    // If too much data is buffering up in the
                    // current message, wait for it to drain.
                    message.once('drain', ()=>{
                        this.processBufferedData(callback);
                    });
                    return;
                }
            } else {
                break;
            }
        }
        // Not enough data to read the next packet. Stop here and wait for
        // the next call to `_transform`.
        callback();
    }
    _transform(chunk, _encoding, callback) {
        this.bl.append(chunk);
        this.processBufferedData(callback);
    }
}
var _default = exports.default = IncomingMessageStream;
module.exports = IncomingMessageStream; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmwiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9zdHJlYW0iLCJfbWVzc2FnZSIsIl9wYWNrZXQiLCJfZXJyb3JzIiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiSW5jb21pbmdNZXNzYWdlU3RyZWFtIiwiVHJhbnNmb3JtIiwiY29uc3RydWN0b3IiLCJkZWJ1ZyIsInJlYWRhYmxlT2JqZWN0TW9kZSIsImN1cnJlbnRNZXNzYWdlIiwidW5kZWZpbmVkIiwiYmwiLCJCdWZmZXJMaXN0IiwicGF1c2UiLCJyZXN1bWUiLCJwcm9jZXNzQnVmZmVyZWREYXRhIiwiY2FsbGJhY2siLCJsZW5ndGgiLCJIRUFERVJfTEVOR1RIIiwicmVhZFVJbnQxNkJFIiwiQ29ubmVjdGlvbkVycm9yIiwiZGF0YSIsInNsaWNlIiwiY29uc3VtZSIsInBhY2tldCIsIlBhY2tldCIsIm1lc3NhZ2UiLCJNZXNzYWdlIiwidHlwZSIsInJlc2V0Q29ubmVjdGlvbiIsInB1c2giLCJpc0xhc3QiLCJvbmNlIiwiZW5kIiwid3JpdGUiLCJfdHJhbnNmb3JtIiwiY2h1bmsiLCJfZW5jb2RpbmciLCJhcHBlbmQiLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiXSwic291cmNlcyI6WyIuLi9zcmMvaW5jb21pbmctbWVzc2FnZS1zdHJlYW0udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJ1ZmZlckxpc3QgZnJvbSAnYmwnO1xuaW1wb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSAnc3RyZWFtJztcblxuaW1wb3J0IERlYnVnIGZyb20gJy4vZGVidWcnO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9tZXNzYWdlJztcbmltcG9ydCB7IFBhY2tldCwgSEVBREVSX0xFTkdUSCB9IGZyb20gJy4vcGFja2V0JztcbmltcG9ydCB7IENvbm5lY3Rpb25FcnJvciB9IGZyb20gJy4vZXJyb3JzJztcblxuLyoqXG4gIEluY29taW5nTWVzc2FnZVN0cmVhbVxuICBUcmFuc2Zvcm0gcmVjZWl2ZWQgVERTIGRhdGEgaW50byBpbmRpdmlkdWFsIEluY29taW5nTWVzc2FnZSBzdHJlYW1zLlxuKi9cbmNsYXNzIEluY29taW5nTWVzc2FnZVN0cmVhbSBleHRlbmRzIFRyYW5zZm9ybSB7XG4gIGRlY2xhcmUgZGVidWc6IERlYnVnO1xuICBkZWNsYXJlIGJsOiBhbnk7XG4gIGRlY2xhcmUgY3VycmVudE1lc3NhZ2U6IE1lc3NhZ2UgfCB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoZGVidWc6IERlYnVnKSB7XG4gICAgc3VwZXIoeyByZWFkYWJsZU9iamVjdE1vZGU6IHRydWUgfSk7XG5cbiAgICB0aGlzLmRlYnVnID0gZGVidWc7XG5cbiAgICB0aGlzLmN1cnJlbnRNZXNzYWdlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuYmwgPSBuZXcgQnVmZmVyTGlzdCgpO1xuICB9XG5cbiAgcGF1c2UoKSB7XG4gICAgc3VwZXIucGF1c2UoKTtcblxuICAgIGlmICh0aGlzLmN1cnJlbnRNZXNzYWdlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRNZXNzYWdlLnBhdXNlKCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXN1bWUoKSB7XG4gICAgc3VwZXIucmVzdW1lKCk7XG5cbiAgICBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSkge1xuICAgICAgdGhpcy5jdXJyZW50TWVzc2FnZS5yZXN1bWUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByb2Nlc3NCdWZmZXJlZERhdGEoY2FsbGJhY2s6IChlcnI/OiBDb25uZWN0aW9uRXJyb3IpID0+IHZvaWQpIHtcbiAgICAvLyBUaGUgcGFja2V0IGhlYWRlciBpcyBhbHdheXMgOCBieXRlcyBvZiBsZW5ndGguXG4gICAgd2hpbGUgKHRoaXMuYmwubGVuZ3RoID49IEhFQURFUl9MRU5HVEgpIHtcbiAgICAgIC8vIEdldCB0aGUgZnVsbCBwYWNrZXQgbGVuZ3RoXG4gICAgICBjb25zdCBsZW5ndGggPSB0aGlzLmJsLnJlYWRVSW50MTZCRSgyKTtcbiAgICAgIGlmIChsZW5ndGggPCBIRUFERVJfTEVOR1RIKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhuZXcgQ29ubmVjdGlvbkVycm9yKCdVbmFibGUgdG8gcHJvY2VzcyBpbmNvbWluZyBwYWNrZXQnKSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJsLmxlbmd0aCA+PSBsZW5ndGgpIHtcbiAgICAgICAgY29uc3QgZGF0YSA9IHRoaXMuYmwuc2xpY2UoMCwgbGVuZ3RoKTtcbiAgICAgICAgdGhpcy5ibC5jb25zdW1lKGxlbmd0aCk7XG5cbiAgICAgICAgLy8gVE9ETzogR2V0IHJpZCBvZiBjcmVhdGluZyBgUGFja2V0YCBpbnN0YW5jZXMgaGVyZS5cbiAgICAgICAgY29uc3QgcGFja2V0ID0gbmV3IFBhY2tldChkYXRhKTtcbiAgICAgICAgdGhpcy5kZWJ1Zy5wYWNrZXQoJ1JlY2VpdmVkJywgcGFja2V0KTtcbiAgICAgICAgdGhpcy5kZWJ1Zy5kYXRhKHBhY2tldCk7XG5cbiAgICAgICAgbGV0IG1lc3NhZ2UgPSB0aGlzLmN1cnJlbnRNZXNzYWdlO1xuICAgICAgICBpZiAobWVzc2FnZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TWVzc2FnZSA9IG1lc3NhZ2UgPSBuZXcgTWVzc2FnZSh7IHR5cGU6IHBhY2tldC50eXBlKCksIHJlc2V0Q29ubmVjdGlvbjogZmFsc2UgfSk7XG4gICAgICAgICAgdGhpcy5wdXNoKG1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBhY2tldC5pc0xhc3QoKSkge1xuICAgICAgICAgIC8vIFdhaXQgdW50aWwgdGhlIGN1cnJlbnQgbWVzc2FnZSB3YXMgZnVsbHkgcHJvY2Vzc2VkIGJlZm9yZSB3ZVxuICAgICAgICAgIC8vIGNvbnRpbnVlIHByb2Nlc3NpbmcgYW55IHJlbWFpbmluZyBtZXNzYWdlcy5cbiAgICAgICAgICBtZXNzYWdlLm9uY2UoJ2VuZCcsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudE1lc3NhZ2UgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLnByb2Nlc3NCdWZmZXJlZERhdGEoY2FsbGJhY2spO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIG1lc3NhZ2UuZW5kKHBhY2tldC5kYXRhKCkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIGlmICghbWVzc2FnZS53cml0ZShwYWNrZXQuZGF0YSgpKSkge1xuICAgICAgICAgIC8vIElmIHRvbyBtdWNoIGRhdGEgaXMgYnVmZmVyaW5nIHVwIGluIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgbWVzc2FnZSwgd2FpdCBmb3IgaXQgdG8gZHJhaW4uXG4gICAgICAgICAgbWVzc2FnZS5vbmNlKCdkcmFpbicsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0J1ZmZlcmVkRGF0YShjYWxsYmFjayk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3QgZW5vdWdoIGRhdGEgdG8gcmVhZCB0aGUgbmV4dCBwYWNrZXQuIFN0b3AgaGVyZSBhbmQgd2FpdCBmb3JcbiAgICAvLyB0aGUgbmV4dCBjYWxsIHRvIGBfdHJhbnNmb3JtYC5cbiAgICBjYWxsYmFjaygpO1xuICB9XG5cbiAgX3RyYW5zZm9ybShjaHVuazogQnVmZmVyLCBfZW5jb2Rpbmc6IHN0cmluZywgY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcbiAgICB0aGlzLmJsLmFwcGVuZChjaHVuayk7XG4gICAgdGhpcy5wcm9jZXNzQnVmZmVyZWREYXRhKGNhbGxiYWNrKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBJbmNvbWluZ01lc3NhZ2VTdHJlYW07XG5tb2R1bGUuZXhwb3J0cyA9IEluY29taW5nTWVzc2FnZVN0cmVhbTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/outgoing-message-stream.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _bl = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/bl@6.1.6/node_modules/bl/bl.js [app-route] (ecmascript)"));
var _stream = __turbopack_context__.r("[externals]/stream [external] (stream, cjs)");
var _packet = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/packet.js [app-route] (ecmascript)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
class OutgoingMessageStream extends _stream.Duplex {
    constructor(debug, { packetSize }){
        super({
            writableObjectMode: true
        });
        this.packetSize = packetSize;
        this.debug = debug;
        this.bl = new _bl.default();
        // When the writable side is ended, push `null`
        // to also end the readable side.
        this.on('finish', ()=>{
            this.push(null);
        });
    }
    _write(message, _encoding, callback) {
        const length = this.packetSize - _packet.HEADER_LENGTH;
        let packetNumber = 0;
        this.currentMessage = message;
        this.currentMessage.on('data', (data)=>{
            if (message.ignore) {
                return;
            }
            this.bl.append(data);
            while(this.bl.length > length){
                const data = this.bl.slice(0, length);
                this.bl.consume(length);
                // TODO: Get rid of creating `Packet` instances here.
                const packet = new _packet.Packet(message.type);
                packet.packetId(packetNumber += 1);
                packet.resetConnection(message.resetConnection);
                packet.addData(data);
                this.debug.packet('Sent', packet);
                this.debug.data(packet);
                if (this.push(packet.buffer) === false) {
                    message.pause();
                }
            }
        });
        this.currentMessage.on('end', ()=>{
            const data = this.bl.slice();
            this.bl.consume(data.length);
            // TODO: Get rid of creating `Packet` instances here.
            const packet = new _packet.Packet(message.type);
            packet.packetId(packetNumber += 1);
            packet.resetConnection(message.resetConnection);
            packet.last(true);
            packet.ignore(message.ignore);
            packet.addData(data);
            this.debug.packet('Sent', packet);
            this.debug.data(packet);
            this.push(packet.buffer);
            this.currentMessage = undefined;
            callback();
        });
    }
    _read(_size) {
        // If we do have a message, resume it and get data flowing.
        // Otherwise, there is nothing to do.
        if (this.currentMessage) {
            this.currentMessage.resume();
        }
    }
}
var _default = exports.default = OutgoingMessageStream;
module.exports = OutgoingMessageStream; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYmwiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9zdHJlYW0iLCJfcGFja2V0IiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiT3V0Z29pbmdNZXNzYWdlU3RyZWFtIiwiRHVwbGV4IiwiY29uc3RydWN0b3IiLCJkZWJ1ZyIsInBhY2tldFNpemUiLCJ3cml0YWJsZU9iamVjdE1vZGUiLCJibCIsIkJ1ZmZlckxpc3QiLCJvbiIsInB1c2giLCJfd3JpdGUiLCJtZXNzYWdlIiwiX2VuY29kaW5nIiwiY2FsbGJhY2siLCJsZW5ndGgiLCJIRUFERVJfTEVOR1RIIiwicGFja2V0TnVtYmVyIiwiY3VycmVudE1lc3NhZ2UiLCJkYXRhIiwiaWdub3JlIiwiYXBwZW5kIiwic2xpY2UiLCJjb25zdW1lIiwicGFja2V0IiwiUGFja2V0IiwidHlwZSIsInBhY2tldElkIiwicmVzZXRDb25uZWN0aW9uIiwiYWRkRGF0YSIsImJ1ZmZlciIsInBhdXNlIiwibGFzdCIsInVuZGVmaW5lZCIsIl9yZWFkIiwiX3NpemUiLCJyZXN1bWUiLCJfZGVmYXVsdCIsImV4cG9ydHMiLCJtb2R1bGUiXSwic291cmNlcyI6WyIuLi9zcmMvb3V0Z29pbmctbWVzc2FnZS1zdHJlYW0udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJ1ZmZlckxpc3QgZnJvbSAnYmwnO1xuaW1wb3J0IHsgRHVwbGV4IH0gZnJvbSAnc3RyZWFtJztcblxuaW1wb3J0IERlYnVnIGZyb20gJy4vZGVidWcnO1xuaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9tZXNzYWdlJztcbmltcG9ydCB7IFBhY2tldCwgSEVBREVSX0xFTkdUSCB9IGZyb20gJy4vcGFja2V0JztcblxuY2xhc3MgT3V0Z29pbmdNZXNzYWdlU3RyZWFtIGV4dGVuZHMgRHVwbGV4IHtcbiAgZGVjbGFyZSBwYWNrZXRTaXplOiBudW1iZXI7XG4gIGRlY2xhcmUgZGVidWc6IERlYnVnO1xuICBkZWNsYXJlIGJsOiBhbnk7XG5cbiAgZGVjbGFyZSBjdXJyZW50TWVzc2FnZTogTWVzc2FnZSB8IHVuZGVmaW5lZDtcblxuICBjb25zdHJ1Y3RvcihkZWJ1ZzogRGVidWcsIHsgcGFja2V0U2l6ZSB9OiB7IHBhY2tldFNpemU6IG51bWJlciB9KSB7XG4gICAgc3VwZXIoeyB3cml0YWJsZU9iamVjdE1vZGU6IHRydWUgfSk7XG5cbiAgICB0aGlzLnBhY2tldFNpemUgPSBwYWNrZXRTaXplO1xuICAgIHRoaXMuZGVidWcgPSBkZWJ1ZztcbiAgICB0aGlzLmJsID0gbmV3IEJ1ZmZlckxpc3QoKTtcblxuICAgIC8vIFdoZW4gdGhlIHdyaXRhYmxlIHNpZGUgaXMgZW5kZWQsIHB1c2ggYG51bGxgXG4gICAgLy8gdG8gYWxzbyBlbmQgdGhlIHJlYWRhYmxlIHNpZGUuXG4gICAgdGhpcy5vbignZmluaXNoJywgKCkgPT4ge1xuICAgICAgdGhpcy5wdXNoKG51bGwpO1xuICAgIH0pO1xuICB9XG5cbiAgX3dyaXRlKG1lc3NhZ2U6IE1lc3NhZ2UsIF9lbmNvZGluZzogc3RyaW5nLCBjYWxsYmFjazogKGVycj86IEVycm9yIHwgbnVsbCkgPT4gdm9pZCkge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMucGFja2V0U2l6ZSAtIEhFQURFUl9MRU5HVEg7XG4gICAgbGV0IHBhY2tldE51bWJlciA9IDA7XG5cbiAgICB0aGlzLmN1cnJlbnRNZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLmN1cnJlbnRNZXNzYWdlLm9uKCdkYXRhJywgKGRhdGE6IEJ1ZmZlcikgPT4ge1xuICAgICAgaWYgKG1lc3NhZ2UuaWdub3JlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5ibC5hcHBlbmQoZGF0YSk7XG5cbiAgICAgIHdoaWxlICh0aGlzLmJsLmxlbmd0aCA+IGxlbmd0aCkge1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5ibC5zbGljZSgwLCBsZW5ndGgpO1xuICAgICAgICB0aGlzLmJsLmNvbnN1bWUobGVuZ3RoKTtcblxuICAgICAgICAvLyBUT0RPOiBHZXQgcmlkIG9mIGNyZWF0aW5nIGBQYWNrZXRgIGluc3RhbmNlcyBoZXJlLlxuICAgICAgICBjb25zdCBwYWNrZXQgPSBuZXcgUGFja2V0KG1lc3NhZ2UudHlwZSk7XG4gICAgICAgIHBhY2tldC5wYWNrZXRJZChwYWNrZXROdW1iZXIgKz0gMSk7XG4gICAgICAgIHBhY2tldC5yZXNldENvbm5lY3Rpb24obWVzc2FnZS5yZXNldENvbm5lY3Rpb24pO1xuICAgICAgICBwYWNrZXQuYWRkRGF0YShkYXRhKTtcblxuICAgICAgICB0aGlzLmRlYnVnLnBhY2tldCgnU2VudCcsIHBhY2tldCk7XG4gICAgICAgIHRoaXMuZGVidWcuZGF0YShwYWNrZXQpO1xuXG4gICAgICAgIGlmICh0aGlzLnB1c2gocGFja2V0LmJ1ZmZlcikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgbWVzc2FnZS5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmN1cnJlbnRNZXNzYWdlLm9uKCdlbmQnLCAoKSA9PiB7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5ibC5zbGljZSgpO1xuICAgICAgdGhpcy5ibC5jb25zdW1lKGRhdGEubGVuZ3RoKTtcblxuICAgICAgLy8gVE9ETzogR2V0IHJpZCBvZiBjcmVhdGluZyBgUGFja2V0YCBpbnN0YW5jZXMgaGVyZS5cbiAgICAgIGNvbnN0IHBhY2tldCA9IG5ldyBQYWNrZXQobWVzc2FnZS50eXBlKTtcbiAgICAgIHBhY2tldC5wYWNrZXRJZChwYWNrZXROdW1iZXIgKz0gMSk7XG4gICAgICBwYWNrZXQucmVzZXRDb25uZWN0aW9uKG1lc3NhZ2UucmVzZXRDb25uZWN0aW9uKTtcbiAgICAgIHBhY2tldC5sYXN0KHRydWUpO1xuICAgICAgcGFja2V0Lmlnbm9yZShtZXNzYWdlLmlnbm9yZSk7XG4gICAgICBwYWNrZXQuYWRkRGF0YShkYXRhKTtcblxuICAgICAgdGhpcy5kZWJ1Zy5wYWNrZXQoJ1NlbnQnLCBwYWNrZXQpO1xuICAgICAgdGhpcy5kZWJ1Zy5kYXRhKHBhY2tldCk7XG5cbiAgICAgIHRoaXMucHVzaChwYWNrZXQuYnVmZmVyKTtcblxuICAgICAgdGhpcy5jdXJyZW50TWVzc2FnZSA9IHVuZGVmaW5lZDtcblxuICAgICAgY2FsbGJhY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9yZWFkKF9zaXplOiBudW1iZXIpIHtcbiAgICAvLyBJZiB3ZSBkbyBoYXZlIGEgbWVzc2FnZSwgcmVzdW1lIGl0IGFuZCBnZXQgZGF0YSBmbG93aW5nLlxuICAgIC8vIE90aGVyd2lzZSwgdGhlcmUgaXMgbm90aGluZyB0byBkby5cbiAgICBpZiAodGhpcy5jdXJyZW50TWVzc2FnZSkge1xuICAgICAgdGhpcy5jdXJyZW50TWVzc2FnZS5yZXN1bWUoKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgT3V0Z29pbmdNZXNzYWdlU3RyZWFtO1xubW9kdWxlLmV4cG9ydHMgPSBPdXRnb2luZ01lc3NhZ2VTdHJlYW07XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEdBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLE9BQUEsR0FBQUQsT0FBQTtBQUlBLElBQUFFLE9BQUEsR0FBQUYsT0FBQTtBQUFpRCxTQUFBRCx1QkFBQUksQ0FBQSxXQUFBQSxDQUFBLElBQUFBLENBQUEsQ0FBQUMsVUFBQSxHQUFBRCxDQUFBLEtBQUFFLE9BQUEsRUFBQUYsQ0FBQTtBQUVqRCxNQUFNRyxxQkFBcUIsU0FBU0MsY0FBTSxDQUFDO0VBT3pDQyxXQUFXQSxDQUFDQyxLQUFZLEVBQUU7SUFBRUM7RUFBbUMsQ0FBQyxFQUFFO0lBQ2hFLEtBQUssQ0FBQztNQUFFQyxrQkFBa0IsRUFBRTtJQUFLLENBQUMsQ0FBQztJQUVuQyxJQUFJLENBQUNELFVBQVUsR0FBR0EsVUFBVTtJQUM1QixJQUFJLENBQUNELEtBQUssR0FBR0EsS0FBSztJQUNsQixJQUFJLENBQUNHLEVBQUUsR0FBRyxJQUFJQyxXQUFVLENBQUMsQ0FBQzs7SUFFMUI7SUFDQTtJQUNBLElBQUksQ0FBQ0MsRUFBRSxDQUFDLFFBQVEsRUFBRSxNQUFNO01BQ3RCLElBQUksQ0FBQ0MsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNqQixDQUFDLENBQUM7RUFDSjtFQUVBQyxNQUFNQSxDQUFDQyxPQUFnQixFQUFFQyxTQUFpQixFQUFFQyxRQUFzQyxFQUFFO0lBQ2xGLE1BQU1DLE1BQU0sR0FBRyxJQUFJLENBQUNWLFVBQVUsR0FBR1cscUJBQWE7SUFDOUMsSUFBSUMsWUFBWSxHQUFHLENBQUM7SUFFcEIsSUFBSSxDQUFDQyxjQUFjLEdBQUdOLE9BQU87SUFDN0IsSUFBSSxDQUFDTSxjQUFjLENBQUNULEVBQUUsQ0FBQyxNQUFNLEVBQUdVLElBQVksSUFBSztNQUMvQyxJQUFJUCxPQUFPLENBQUNRLE1BQU0sRUFBRTtRQUNsQjtNQUNGO01BRUEsSUFBSSxDQUFDYixFQUFFLENBQUNjLE1BQU0sQ0FBQ0YsSUFBSSxDQUFDO01BRXBCLE9BQU8sSUFBSSxDQUFDWixFQUFFLENBQUNRLE1BQU0sR0FBR0EsTUFBTSxFQUFFO1FBQzlCLE1BQU1JLElBQUksR0FBRyxJQUFJLENBQUNaLEVBQUUsQ0FBQ2UsS0FBSyxDQUFDLENBQUMsRUFBRVAsTUFBTSxDQUFDO1FBQ3JDLElBQUksQ0FBQ1IsRUFBRSxDQUFDZ0IsT0FBTyxDQUFDUixNQUFNLENBQUM7O1FBRXZCO1FBQ0EsTUFBTVMsTUFBTSxHQUFHLElBQUlDLGNBQU0sQ0FBQ2IsT0FBTyxDQUFDYyxJQUFJLENBQUM7UUFDdkNGLE1BQU0sQ0FBQ0csUUFBUSxDQUFDVixZQUFZLElBQUksQ0FBQyxDQUFDO1FBQ2xDTyxNQUFNLENBQUNJLGVBQWUsQ0FBQ2hCLE9BQU8sQ0FBQ2dCLGVBQWUsQ0FBQztRQUMvQ0osTUFBTSxDQUFDSyxPQUFPLENBQUNWLElBQUksQ0FBQztRQUVwQixJQUFJLENBQUNmLEtBQUssQ0FBQ29CLE1BQU0sQ0FBQyxNQUFNLEVBQUVBLE1BQU0sQ0FBQztRQUNqQyxJQUFJLENBQUNwQixLQUFLLENBQUNlLElBQUksQ0FBQ0ssTUFBTSxDQUFDO1FBRXZCLElBQUksSUFBSSxDQUFDZCxJQUFJLENBQUNjLE1BQU0sQ0FBQ00sTUFBTSxDQUFDLEtBQUssS0FBSyxFQUFFO1VBQ3RDbEIsT0FBTyxDQUFDbUIsS0FBSyxDQUFDLENBQUM7UUFDakI7TUFDRjtJQUNGLENBQUMsQ0FBQztJQUVGLElBQUksQ0FBQ2IsY0FBYyxDQUFDVCxFQUFFLENBQUMsS0FBSyxFQUFFLE1BQU07TUFDbEMsTUFBTVUsSUFBSSxHQUFHLElBQUksQ0FBQ1osRUFBRSxDQUFDZSxLQUFLLENBQUMsQ0FBQztNQUM1QixJQUFJLENBQUNmLEVBQUUsQ0FBQ2dCLE9BQU8sQ0FBQ0osSUFBSSxDQUFDSixNQUFNLENBQUM7O01BRTVCO01BQ0EsTUFBTVMsTUFBTSxHQUFHLElBQUlDLGNBQU0sQ0FBQ2IsT0FBTyxDQUFDYyxJQUFJLENBQUM7TUFDdkNGLE1BQU0sQ0FBQ0csUUFBUSxDQUFDVixZQUFZLElBQUksQ0FBQyxDQUFDO01BQ2xDTyxNQUFNLENBQUNJLGVBQWUsQ0FBQ2hCLE9BQU8sQ0FBQ2dCLGVBQWUsQ0FBQztNQUMvQ0osTUFBTSxDQUFDUSxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ2pCUixNQUFNLENBQUNKLE1BQU0sQ0FBQ1IsT0FBTyxDQUFDUSxNQUFNLENBQUM7TUFDN0JJLE1BQU0sQ0FBQ0ssT0FBTyxDQUFDVixJQUFJLENBQUM7TUFFcEIsSUFBSSxDQUFDZixLQUFLLENBQUNvQixNQUFNLENBQUMsTUFBTSxFQUFFQSxNQUFNLENBQUM7TUFDakMsSUFBSSxDQUFDcEIsS0FBSyxDQUFDZSxJQUFJLENBQUNLLE1BQU0sQ0FBQztNQUV2QixJQUFJLENBQUNkLElBQUksQ0FBQ2MsTUFBTSxDQUFDTSxNQUFNLENBQUM7TUFFeEIsSUFBSSxDQUFDWixjQUFjLEdBQUdlLFNBQVM7TUFFL0JuQixRQUFRLENBQUMsQ0FBQztJQUNaLENBQUMsQ0FBQztFQUNKO0VBRUFvQixLQUFLQSxDQUFDQyxLQUFhLEVBQUU7SUFDbkI7SUFDQTtJQUNBLElBQUksSUFBSSxDQUFDakIsY0FBYyxFQUFFO01BQ3ZCLElBQUksQ0FBQ0EsY0FBYyxDQUFDa0IsTUFBTSxDQUFDLENBQUM7SUFDOUI7RUFDRjtBQUNGO0FBQUMsSUFBQUMsUUFBQSxHQUFBQyxPQUFBLENBQUF0QyxPQUFBLEdBRWNDLHFCQUFxQjtBQUNwQ3NDLE1BQU0sQ0FBQ0QsT0FBTyxHQUFHckMscUJBQXFCIiwiaWdub3JlTGlzdCI6W119
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/message-io.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
var _nativeDuplexpair = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/native-duplexpair@1.0.0/node_modules/native-duplexpair/index.js [app-route] (ecmascript)"));
var tls = _interopRequireWildcard(__turbopack_context__.r("[externals]/tls [external] (tls, cjs)"));
var _events = __turbopack_context__.r("[externals]/events [external] (events, cjs)");
var _message = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/message.js [app-route] (ecmascript)"));
var _packet = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/packet.js [app-route] (ecmascript)");
var _incomingMessageStream = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/incoming-message-stream.js [app-route] (ecmascript)"));
var _outgoingMessageStream = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/outgoing-message-stream.js [app-route] (ecmascript)"));
function _interopRequireWildcard(e, t) {
    if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap();
    return (_interopRequireWildcard = function(e, t) {
        if (!t && e && e.__esModule) return e;
        var o, i, f = {
            __proto__: null,
            default: e
        };
        if (null === e || "object" != typeof e && "function" != typeof e) return f;
        if (o = t ? n : r) {
            if (o.has(e)) return o.get(e);
            o.set(e, f);
        }
        for(const t in e)"default" !== t && ({}).hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]);
        return f;
    })(e, t);
}
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
class MessageIO extends _events.EventEmitter {
    constructor(socket, packetSize, debug){
        super();
        this.socket = socket;
        this.debug = debug;
        this.tlsNegotiationComplete = false;
        this.incomingMessageStream = new _incomingMessageStream.default(this.debug);
        this.incomingMessageIterator = this.incomingMessageStream[Symbol.asyncIterator]();
        this.outgoingMessageStream = new _outgoingMessageStream.default(this.debug, {
            packetSize: packetSize
        });
        this.socket.pipe(this.incomingMessageStream);
        this.outgoingMessageStream.pipe(this.socket);
    }
    packetSize(...args) {
        if (args.length > 0) {
            const packetSize = args[0];
            this.debug.log('Packet size changed from ' + this.outgoingMessageStream.packetSize + ' to ' + packetSize);
            this.outgoingMessageStream.packetSize = packetSize;
        }
        if (this.securePair) {
            this.securePair.cleartext.setMaxSendFragment(this.outgoingMessageStream.packetSize);
        }
        return this.outgoingMessageStream.packetSize;
    }
    // Negotiate TLS encryption.
    startTls(credentialsDetails, hostname, trustServerCertificate) {
        if (!credentialsDetails.maxVersion || ![
            'TLSv1.2',
            'TLSv1.1',
            'TLSv1'
        ].includes(credentialsDetails.maxVersion)) {
            credentialsDetails.maxVersion = 'TLSv1.2';
        }
        const secureContext = tls.createSecureContext(credentialsDetails);
        return new Promise((resolve, reject)=>{
            const duplexpair = new _nativeDuplexpair.default();
            const securePair = this.securePair = {
                cleartext: tls.connect({
                    socket: duplexpair.socket1,
                    servername: hostname,
                    secureContext: secureContext,
                    rejectUnauthorized: !trustServerCertificate
                }),
                encrypted: duplexpair.socket2
            };
            const onSecureConnect = ()=>{
                securePair.encrypted.removeListener('readable', onReadable);
                securePair.cleartext.removeListener('error', onError);
                securePair.cleartext.removeListener('secureConnect', onSecureConnect);
                // If we encounter any errors from this point on,
                // we just forward them to the actual network socket.
                securePair.cleartext.once('error', (err)=>{
                    this.socket.destroy(err);
                });
                const cipher = securePair.cleartext.getCipher();
                if (cipher) {
                    this.debug.log('TLS negotiated (' + cipher.name + ', ' + cipher.version + ')');
                }
                this.emit('secure', securePair.cleartext);
                securePair.cleartext.setMaxSendFragment(this.outgoingMessageStream.packetSize);
                this.outgoingMessageStream.unpipe(this.socket);
                this.socket.unpipe(this.incomingMessageStream);
                this.socket.pipe(securePair.encrypted);
                securePair.encrypted.pipe(this.socket);
                securePair.cleartext.pipe(this.incomingMessageStream);
                this.outgoingMessageStream.pipe(securePair.cleartext);
                this.tlsNegotiationComplete = true;
                resolve();
            };
            const onError = (err)=>{
                securePair.encrypted.removeListener('readable', onReadable);
                securePair.cleartext.removeListener('error', onError);
                securePair.cleartext.removeListener('secureConnect', onSecureConnect);
                securePair.cleartext.destroy();
                securePair.encrypted.destroy();
                reject(err);
            };
            const onReadable = ()=>{
                // When there is handshake data on the encrypted stream of the secure pair,
                // we wrap it into a `PRELOGIN` message and send it to the server.
                //
                // For each `PRELOGIN` message we sent we get back exactly one response message
                // that contains the server's handshake response data.
                const message = new _message.default({
                    type: _packet.TYPE.PRELOGIN,
                    resetConnection: false
                });
                let chunk;
                while(chunk = securePair.encrypted.read()){
                    message.write(chunk);
                }
                this.outgoingMessageStream.write(message);
                message.end();
                this.readMessage().then(async (response)=>{
                    // Setup readable handler for the next round of handshaking.
                    // If we encounter a `secureConnect` on the cleartext side
                    // of the secure pair, the `readable` handler is cleared
                    // and no further handshake handling will happen.
                    securePair.encrypted.once('readable', onReadable);
                    for await (const data of response){
                        // We feed the server's handshake response back into the
                        // encrypted end of the secure pair.
                        securePair.encrypted.write(data);
                    }
                }).catch(onError);
            };
            securePair.cleartext.once('error', onError);
            securePair.cleartext.once('secureConnect', onSecureConnect);
            securePair.encrypted.once('readable', onReadable);
        });
    }
    // TODO listen for 'drain' event when socket.write returns false.
    // TODO implement incomplete request cancelation (2.2.1.6)
    sendMessage(packetType, data, resetConnection) {
        const message = new _message.default({
            type: packetType,
            resetConnection: resetConnection
        });
        message.end(data);
        this.outgoingMessageStream.write(message);
        return message;
    }
    /**
   * Read the next incoming message from the socket.
   */ async readMessage() {
        const result = await this.incomingMessageIterator.next();
        if (result.done) {
            throw new Error('unexpected end of message stream');
        }
        return result.value;
    }
}
var _default = exports.default = MessageIO;
module.exports = MessageIO; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbmF0aXZlRHVwbGV4cGFpciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwidGxzIiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfZXZlbnRzIiwiX21lc3NhZ2UiLCJfcGFja2V0IiwiX2luY29taW5nTWVzc2FnZVN0cmVhbSIsIl9vdXRnb2luZ01lc3NhZ2VTdHJlYW0iLCJlIiwidCIsIldlYWtNYXAiLCJyIiwibiIsIl9fZXNNb2R1bGUiLCJvIiwiaSIsImYiLCJfX3Byb3RvX18iLCJkZWZhdWx0IiwiaGFzIiwiZ2V0Iiwic2V0IiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJNZXNzYWdlSU8iLCJFdmVudEVtaXR0ZXIiLCJjb25zdHJ1Y3RvciIsInNvY2tldCIsInBhY2tldFNpemUiLCJkZWJ1ZyIsInRsc05lZ290aWF0aW9uQ29tcGxldGUiLCJpbmNvbWluZ01lc3NhZ2VTdHJlYW0iLCJJbmNvbWluZ01lc3NhZ2VTdHJlYW0iLCJpbmNvbWluZ01lc3NhZ2VJdGVyYXRvciIsIlN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJvdXRnb2luZ01lc3NhZ2VTdHJlYW0iLCJPdXRnb2luZ01lc3NhZ2VTdHJlYW0iLCJwaXBlIiwiYXJncyIsImxlbmd0aCIsImxvZyIsInNlY3VyZVBhaXIiLCJjbGVhcnRleHQiLCJzZXRNYXhTZW5kRnJhZ21lbnQiLCJzdGFydFRscyIsImNyZWRlbnRpYWxzRGV0YWlscyIsImhvc3RuYW1lIiwidHJ1c3RTZXJ2ZXJDZXJ0aWZpY2F0ZSIsIm1heFZlcnNpb24iLCJpbmNsdWRlcyIsInNlY3VyZUNvbnRleHQiLCJjcmVhdGVTZWN1cmVDb250ZXh0IiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJkdXBsZXhwYWlyIiwiRHVwbGV4UGFpciIsImNvbm5lY3QiLCJzb2NrZXQxIiwic2VydmVybmFtZSIsInJlamVjdFVuYXV0aG9yaXplZCIsImVuY3J5cHRlZCIsInNvY2tldDIiLCJvblNlY3VyZUNvbm5lY3QiLCJyZW1vdmVMaXN0ZW5lciIsIm9uUmVhZGFibGUiLCJvbkVycm9yIiwib25jZSIsImVyciIsImRlc3Ryb3kiLCJjaXBoZXIiLCJnZXRDaXBoZXIiLCJuYW1lIiwidmVyc2lvbiIsImVtaXQiLCJ1bnBpcGUiLCJtZXNzYWdlIiwiTWVzc2FnZSIsInR5cGUiLCJUWVBFIiwiUFJFTE9HSU4iLCJyZXNldENvbm5lY3Rpb24iLCJjaHVuayIsInJlYWQiLCJ3cml0ZSIsImVuZCIsInJlYWRNZXNzYWdlIiwidGhlbiIsInJlc3BvbnNlIiwiZGF0YSIsImNhdGNoIiwic2VuZE1lc3NhZ2UiLCJwYWNrZXRUeXBlIiwicmVzdWx0IiwibmV4dCIsImRvbmUiLCJFcnJvciIsInZhbHVlIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwibW9kdWxlIl0sInNvdXJjZXMiOlsiLi4vc3JjL21lc3NhZ2UtaW8udHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IER1cGxleFBhaXIgZnJvbSAnbmF0aXZlLWR1cGxleHBhaXInO1xuXG5pbXBvcnQgeyBEdXBsZXggfSBmcm9tICdzdHJlYW0nO1xuaW1wb3J0ICogYXMgdGxzIGZyb20gJ3Rscyc7XG5pbXBvcnQgeyBTb2NrZXQgfSBmcm9tICduZXQnO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuaW1wb3J0IERlYnVnIGZyb20gJy4vZGVidWcnO1xuXG5pbXBvcnQgTWVzc2FnZSBmcm9tICcuL21lc3NhZ2UnO1xuaW1wb3J0IHsgVFlQRSB9IGZyb20gJy4vcGFja2V0JztcblxuaW1wb3J0IEluY29taW5nTWVzc2FnZVN0cmVhbSBmcm9tICcuL2luY29taW5nLW1lc3NhZ2Utc3RyZWFtJztcbmltcG9ydCBPdXRnb2luZ01lc3NhZ2VTdHJlYW0gZnJvbSAnLi9vdXRnb2luZy1tZXNzYWdlLXN0cmVhbSc7XG5cbmNsYXNzIE1lc3NhZ2VJTyBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gIGRlY2xhcmUgc29ja2V0OiBTb2NrZXQ7XG4gIGRlY2xhcmUgZGVidWc6IERlYnVnO1xuXG4gIGRlY2xhcmUgdGxzTmVnb3RpYXRpb25Db21wbGV0ZTogYm9vbGVhbjtcblxuICBkZWNsYXJlIHByaXZhdGUgaW5jb21pbmdNZXNzYWdlU3RyZWFtOiBJbmNvbWluZ01lc3NhZ2VTdHJlYW07XG4gIGRlY2xhcmUgb3V0Z29pbmdNZXNzYWdlU3RyZWFtOiBPdXRnb2luZ01lc3NhZ2VTdHJlYW07XG5cbiAgZGVjbGFyZSBzZWN1cmVQYWlyPzoge1xuICAgIGNsZWFydGV4dDogdGxzLlRMU1NvY2tldDtcbiAgICBlbmNyeXB0ZWQ6IER1cGxleDtcbiAgfTtcblxuICBkZWNsYXJlIGluY29taW5nTWVzc2FnZUl0ZXJhdG9yOiBBc3luY0l0ZXJhYmxlSXRlcmF0b3I8TWVzc2FnZT47XG5cbiAgY29uc3RydWN0b3Ioc29ja2V0OiBTb2NrZXQsIHBhY2tldFNpemU6IG51bWJlciwgZGVidWc6IERlYnVnKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0O1xuICAgIHRoaXMuZGVidWcgPSBkZWJ1ZztcblxuICAgIHRoaXMudGxzTmVnb3RpYXRpb25Db21wbGV0ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5pbmNvbWluZ01lc3NhZ2VTdHJlYW0gPSBuZXcgSW5jb21pbmdNZXNzYWdlU3RyZWFtKHRoaXMuZGVidWcpO1xuICAgIHRoaXMuaW5jb21pbmdNZXNzYWdlSXRlcmF0b3IgPSB0aGlzLmluY29taW5nTWVzc2FnZVN0cmVhbVtTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKTtcblxuICAgIHRoaXMub3V0Z29pbmdNZXNzYWdlU3RyZWFtID0gbmV3IE91dGdvaW5nTWVzc2FnZVN0cmVhbSh0aGlzLmRlYnVnLCB7IHBhY2tldFNpemU6IHBhY2tldFNpemUgfSk7XG5cbiAgICB0aGlzLnNvY2tldC5waXBlKHRoaXMuaW5jb21pbmdNZXNzYWdlU3RyZWFtKTtcbiAgICB0aGlzLm91dGdvaW5nTWVzc2FnZVN0cmVhbS5waXBlKHRoaXMuc29ja2V0KTtcbiAgfVxuXG4gIHBhY2tldFNpemUoLi4uYXJnczogW251bWJlcl0pIHtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBwYWNrZXRTaXplID0gYXJnc1swXTtcbiAgICAgIHRoaXMuZGVidWcubG9nKCdQYWNrZXQgc2l6ZSBjaGFuZ2VkIGZyb20gJyArIHRoaXMub3V0Z29pbmdNZXNzYWdlU3RyZWFtLnBhY2tldFNpemUgKyAnIHRvICcgKyBwYWNrZXRTaXplKTtcbiAgICAgIHRoaXMub3V0Z29pbmdNZXNzYWdlU3RyZWFtLnBhY2tldFNpemUgPSBwYWNrZXRTaXplO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNlY3VyZVBhaXIpIHtcbiAgICAgIHRoaXMuc2VjdXJlUGFpci5jbGVhcnRleHQuc2V0TWF4U2VuZEZyYWdtZW50KHRoaXMub3V0Z29pbmdNZXNzYWdlU3RyZWFtLnBhY2tldFNpemUpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm91dGdvaW5nTWVzc2FnZVN0cmVhbS5wYWNrZXRTaXplO1xuICB9XG5cbiAgLy8gTmVnb3RpYXRlIFRMUyBlbmNyeXB0aW9uLlxuICBzdGFydFRscyhjcmVkZW50aWFsc0RldGFpbHM6IHRscy5TZWN1cmVDb250ZXh0T3B0aW9ucywgaG9zdG5hbWU6IHN0cmluZywgdHJ1c3RTZXJ2ZXJDZXJ0aWZpY2F0ZTogYm9vbGVhbikge1xuICAgIGlmICghY3JlZGVudGlhbHNEZXRhaWxzLm1heFZlcnNpb24gfHwgIVsnVExTdjEuMicsICdUTFN2MS4xJywgJ1RMU3YxJ10uaW5jbHVkZXMoY3JlZGVudGlhbHNEZXRhaWxzLm1heFZlcnNpb24pKSB7XG4gICAgICBjcmVkZW50aWFsc0RldGFpbHMubWF4VmVyc2lvbiA9ICdUTFN2MS4yJztcbiAgICB9XG5cbiAgICBjb25zdCBzZWN1cmVDb250ZXh0ID0gdGxzLmNyZWF0ZVNlY3VyZUNvbnRleHQoY3JlZGVudGlhbHNEZXRhaWxzKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBkdXBsZXhwYWlyID0gbmV3IER1cGxleFBhaXIoKTtcbiAgICAgIGNvbnN0IHNlY3VyZVBhaXIgPSB0aGlzLnNlY3VyZVBhaXIgPSB7XG4gICAgICAgIGNsZWFydGV4dDogdGxzLmNvbm5lY3Qoe1xuICAgICAgICAgIHNvY2tldDogZHVwbGV4cGFpci5zb2NrZXQxIGFzIFNvY2tldCxcbiAgICAgICAgICBzZXJ2ZXJuYW1lOiBob3N0bmFtZSxcbiAgICAgICAgICBzZWN1cmVDb250ZXh0OiBzZWN1cmVDb250ZXh0LFxuICAgICAgICAgIHJlamVjdFVuYXV0aG9yaXplZDogIXRydXN0U2VydmVyQ2VydGlmaWNhdGVcbiAgICAgICAgfSksXG4gICAgICAgIGVuY3J5cHRlZDogZHVwbGV4cGFpci5zb2NrZXQyXG4gICAgICB9O1xuXG4gICAgICBjb25zdCBvblNlY3VyZUNvbm5lY3QgPSAoKSA9PiB7XG4gICAgICAgIHNlY3VyZVBhaXIuZW5jcnlwdGVkLnJlbW92ZUxpc3RlbmVyKCdyZWFkYWJsZScsIG9uUmVhZGFibGUpO1xuICAgICAgICBzZWN1cmVQYWlyLmNsZWFydGV4dC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgICAgc2VjdXJlUGFpci5jbGVhcnRleHQucmVtb3ZlTGlzdGVuZXIoJ3NlY3VyZUNvbm5lY3QnLCBvblNlY3VyZUNvbm5lY3QpO1xuXG4gICAgICAgIC8vIElmIHdlIGVuY291bnRlciBhbnkgZXJyb3JzIGZyb20gdGhpcyBwb2ludCBvbixcbiAgICAgICAgLy8gd2UganVzdCBmb3J3YXJkIHRoZW0gdG8gdGhlIGFjdHVhbCBuZXR3b3JrIHNvY2tldC5cbiAgICAgICAgc2VjdXJlUGFpci5jbGVhcnRleHQub25jZSgnZXJyb3InLCAoZXJyKSA9PiB7XG4gICAgICAgICAgdGhpcy5zb2NrZXQuZGVzdHJveShlcnIpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBjaXBoZXIgPSBzZWN1cmVQYWlyLmNsZWFydGV4dC5nZXRDaXBoZXIoKTtcbiAgICAgICAgaWYgKGNpcGhlcikge1xuICAgICAgICAgIHRoaXMuZGVidWcubG9nKCdUTFMgbmVnb3RpYXRlZCAoJyArIGNpcGhlci5uYW1lICsgJywgJyArIGNpcGhlci52ZXJzaW9uICsgJyknKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZW1pdCgnc2VjdXJlJywgc2VjdXJlUGFpci5jbGVhcnRleHQpO1xuXG4gICAgICAgIHNlY3VyZVBhaXIuY2xlYXJ0ZXh0LnNldE1heFNlbmRGcmFnbWVudCh0aGlzLm91dGdvaW5nTWVzc2FnZVN0cmVhbS5wYWNrZXRTaXplKTtcblxuICAgICAgICB0aGlzLm91dGdvaW5nTWVzc2FnZVN0cmVhbS51bnBpcGUodGhpcy5zb2NrZXQpO1xuICAgICAgICB0aGlzLnNvY2tldC51bnBpcGUodGhpcy5pbmNvbWluZ01lc3NhZ2VTdHJlYW0pO1xuXG4gICAgICAgIHRoaXMuc29ja2V0LnBpcGUoc2VjdXJlUGFpci5lbmNyeXB0ZWQpO1xuICAgICAgICBzZWN1cmVQYWlyLmVuY3J5cHRlZC5waXBlKHRoaXMuc29ja2V0KTtcblxuICAgICAgICBzZWN1cmVQYWlyLmNsZWFydGV4dC5waXBlKHRoaXMuaW5jb21pbmdNZXNzYWdlU3RyZWFtKTtcbiAgICAgICAgdGhpcy5vdXRnb2luZ01lc3NhZ2VTdHJlYW0ucGlwZShzZWN1cmVQYWlyLmNsZWFydGV4dCk7XG5cbiAgICAgICAgdGhpcy50bHNOZWdvdGlhdGlvbkNvbXBsZXRlID0gdHJ1ZTtcblxuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9O1xuXG4gICAgICBjb25zdCBvbkVycm9yID0gKGVycj86IEVycm9yKSA9PiB7XG4gICAgICAgIHNlY3VyZVBhaXIuZW5jcnlwdGVkLnJlbW92ZUxpc3RlbmVyKCdyZWFkYWJsZScsIG9uUmVhZGFibGUpO1xuICAgICAgICBzZWN1cmVQYWlyLmNsZWFydGV4dC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgICAgc2VjdXJlUGFpci5jbGVhcnRleHQucmVtb3ZlTGlzdGVuZXIoJ3NlY3VyZUNvbm5lY3QnLCBvblNlY3VyZUNvbm5lY3QpO1xuXG4gICAgICAgIHNlY3VyZVBhaXIuY2xlYXJ0ZXh0LmRlc3Ryb3koKTtcbiAgICAgICAgc2VjdXJlUGFpci5lbmNyeXB0ZWQuZGVzdHJveSgpO1xuXG4gICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgfTtcblxuICAgICAgY29uc3Qgb25SZWFkYWJsZSA9ICgpID0+IHtcbiAgICAgICAgLy8gV2hlbiB0aGVyZSBpcyBoYW5kc2hha2UgZGF0YSBvbiB0aGUgZW5jcnlwdGVkIHN0cmVhbSBvZiB0aGUgc2VjdXJlIHBhaXIsXG4gICAgICAgIC8vIHdlIHdyYXAgaXQgaW50byBhIGBQUkVMT0dJTmAgbWVzc2FnZSBhbmQgc2VuZCBpdCB0byB0aGUgc2VydmVyLlxuICAgICAgICAvL1xuICAgICAgICAvLyBGb3IgZWFjaCBgUFJFTE9HSU5gIG1lc3NhZ2Ugd2Ugc2VudCB3ZSBnZXQgYmFjayBleGFjdGx5IG9uZSByZXNwb25zZSBtZXNzYWdlXG4gICAgICAgIC8vIHRoYXQgY29udGFpbnMgdGhlIHNlcnZlcidzIGhhbmRzaGFrZSByZXNwb25zZSBkYXRhLlxuICAgICAgICBjb25zdCBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoeyB0eXBlOiBUWVBFLlBSRUxPR0lOLCByZXNldENvbm5lY3Rpb246IGZhbHNlIH0pO1xuXG4gICAgICAgIGxldCBjaHVuaztcbiAgICAgICAgd2hpbGUgKGNodW5rID0gc2VjdXJlUGFpci5lbmNyeXB0ZWQucmVhZCgpKSB7XG4gICAgICAgICAgbWVzc2FnZS53cml0ZShjaHVuayk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vdXRnb2luZ01lc3NhZ2VTdHJlYW0ud3JpdGUobWVzc2FnZSk7XG4gICAgICAgIG1lc3NhZ2UuZW5kKCk7XG5cbiAgICAgICAgdGhpcy5yZWFkTWVzc2FnZSgpLnRoZW4oYXN5bmMgKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgICAgLy8gU2V0dXAgcmVhZGFibGUgaGFuZGxlciBmb3IgdGhlIG5leHQgcm91bmQgb2YgaGFuZHNoYWtpbmcuXG4gICAgICAgICAgLy8gSWYgd2UgZW5jb3VudGVyIGEgYHNlY3VyZUNvbm5lY3RgIG9uIHRoZSBjbGVhcnRleHQgc2lkZVxuICAgICAgICAgIC8vIG9mIHRoZSBzZWN1cmUgcGFpciwgdGhlIGByZWFkYWJsZWAgaGFuZGxlciBpcyBjbGVhcmVkXG4gICAgICAgICAgLy8gYW5kIG5vIGZ1cnRoZXIgaGFuZHNoYWtlIGhhbmRsaW5nIHdpbGwgaGFwcGVuLlxuICAgICAgICAgIHNlY3VyZVBhaXIuZW5jcnlwdGVkLm9uY2UoJ3JlYWRhYmxlJywgb25SZWFkYWJsZSk7XG5cbiAgICAgICAgICBmb3IgYXdhaXQgKGNvbnN0IGRhdGEgb2YgcmVzcG9uc2UpIHtcbiAgICAgICAgICAgIC8vIFdlIGZlZWQgdGhlIHNlcnZlcidzIGhhbmRzaGFrZSByZXNwb25zZSBiYWNrIGludG8gdGhlXG4gICAgICAgICAgICAvLyBlbmNyeXB0ZWQgZW5kIG9mIHRoZSBzZWN1cmUgcGFpci5cbiAgICAgICAgICAgIHNlY3VyZVBhaXIuZW5jcnlwdGVkLndyaXRlKGRhdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2gob25FcnJvcik7XG4gICAgICB9O1xuXG4gICAgICBzZWN1cmVQYWlyLmNsZWFydGV4dC5vbmNlKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgc2VjdXJlUGFpci5jbGVhcnRleHQub25jZSgnc2VjdXJlQ29ubmVjdCcsIG9uU2VjdXJlQ29ubmVjdCk7XG4gICAgICBzZWN1cmVQYWlyLmVuY3J5cHRlZC5vbmNlKCdyZWFkYWJsZScsIG9uUmVhZGFibGUpO1xuICAgIH0pO1xuICB9XG5cbiAgLy8gVE9ETyBsaXN0ZW4gZm9yICdkcmFpbicgZXZlbnQgd2hlbiBzb2NrZXQud3JpdGUgcmV0dXJucyBmYWxzZS5cbiAgLy8gVE9ETyBpbXBsZW1lbnQgaW5jb21wbGV0ZSByZXF1ZXN0IGNhbmNlbGF0aW9uICgyLjIuMS42KVxuICBzZW5kTWVzc2FnZShwYWNrZXRUeXBlOiBudW1iZXIsIGRhdGE/OiBCdWZmZXIsIHJlc2V0Q29ubmVjdGlvbj86IGJvb2xlYW4pIHtcbiAgICBjb25zdCBtZXNzYWdlID0gbmV3IE1lc3NhZ2UoeyB0eXBlOiBwYWNrZXRUeXBlLCByZXNldENvbm5lY3Rpb246IHJlc2V0Q29ubmVjdGlvbiB9KTtcbiAgICBtZXNzYWdlLmVuZChkYXRhKTtcbiAgICB0aGlzLm91dGdvaW5nTWVzc2FnZVN0cmVhbS53cml0ZShtZXNzYWdlKTtcbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWFkIHRoZSBuZXh0IGluY29taW5nIG1lc3NhZ2UgZnJvbSB0aGUgc29ja2V0LlxuICAgKi9cbiAgYXN5bmMgcmVhZE1lc3NhZ2UoKTogUHJvbWlzZTxNZXNzYWdlPiB7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5pbmNvbWluZ01lc3NhZ2VJdGVyYXRvci5uZXh0KCk7XG5cbiAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5leHBlY3RlZCBlbmQgb2YgbWVzc2FnZSBzdHJlYW0nKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0LnZhbHVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2VJTztcbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZUlPO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxpQkFBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBR0EsSUFBQUMsR0FBQSxHQUFBQyx1QkFBQSxDQUFBRixPQUFBO0FBRUEsSUFBQUcsT0FBQSxHQUFBSCxPQUFBO0FBSUEsSUFBQUksUUFBQSxHQUFBTCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUssT0FBQSxHQUFBTCxP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QUFXLENBQUMsQ0FBQyxDQUFDQyxJQUFJLENBQUMsTUFBT0MsUUFBUSxJQUFLO1VBQzFDO1VBQ0E7VUFDQTtVQUNBO1VBQ0EvQyxVQUFVLENBQUNvQixTQUFTLENBQUNNLElBQUksQ0FBQyxVQUFVLEVBQUVGLFVBQVUsQ0FBQztVQUVqRCxXQUFXLE1BQU13QixJQUFJLElBQUlELFFBQVEsRUFBRTtZQUNqQztZQUNBO1lBQ0EvQyxVQUFVLENBQUNvQixTQUFTLENBQUN1QixLQUFLLENBQUNLLElBQUksQ0FBQztVQUNsQztRQUNGLENBQUMsQ0FBQyxDQUFDQyxLQUFLLENBQUN4QixPQUFPLENBQUM7TUFDbkIsQ0FBQztNQUVEekIsVUFBVSxDQUFDQyxTQUFTLENBQUN5QixJQUFJLENBQUMsT0FBTyxFQUFFRCxPQUFPLENBQUM7TUFDM0N6QixVQUFVLENBQUNDLFNBQVMsQ0FBQ3lCLElBQUksQ0FBQyxlQUFlLEVBQUVKLGVBQWUsQ0FBQztNQUMzRHRCLFVBQVUsQ0FBQ29CLFNBQVMsQ0FBQ00sSUFBSSxDQUFDLFVBQVUsRUFBRUYsVUFBVSxDQUFDO0lBQ25ELENBQUMsQ0FBQztFQUNKOztFQUVBO0VBQ0E7RUFDQTBCLFdBQVdBLENBQUNDLFVBQWtCLEVBQUVILElBQWEsRUFBRVIsZUFBeUIsRUFBRTtJQUN4RSxNQUFNTCxPQUFPLEdBQUcsSUFBSUMsZ0JBQU8sQ0FBQztNQUFFQyxJQUFJLEVBQUVjLFVBQVU7TUFBRVgsZUFBZSxFQUFFQTtJQUFnQixDQUFDLENBQUM7SUFDbkZMLE9BQU8sQ0FBQ1MsR0FBRyxDQUFDSSxJQUFJLENBQUM7SUFDakIsSUFBSSxDQUFDdEQscUJBQXFCLENBQUNpRCxLQUFLLENBQUNSLE9BQU8sQ0FBQztJQUN6QyxPQUFPQSxPQUFPO0VBQ2hCOztFQUVBO0FBQ0Y7QUFDQTtFQUNFLE1BQU1VLFdBQVdBLENBQUEsRUFBcUI7SUFDcEMsTUFBTU8sTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDN0QsdUJBQXVCLENBQUM4RCxJQUFJLENBQUMsQ0FBQztJQUV4RCxJQUFJRCxNQUFNLENBQUNFLElBQUksRUFBRTtNQUNmLE1BQU0sSUFBSUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDO0lBQ3JEO0lBRUEsT0FBT0gsTUFBTSxDQUFDSSxLQUFLO0VBQ3JCO0FBQ0Y7QUFBQyxJQUFBQyxRQUFBLEdBQUFDLE9BQUEsQ0FBQXJGLE9BQUEsR0FFY1MsU0FBUztBQUN4QjZFLE1BQU0sQ0FBQ0QsT0FBTyxHQUFHNUUsU0FBUyIsImlnbm9yZUxpc3QiOltdfQ==
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/collation.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.codepageBySortId = exports.codepageByLanguageId = exports.Flags = exports.Collation = void 0;
// http://technet.microsoft.com/en-us/library/aa176553(v=sql.80).aspx
const codepageByLanguageId = exports.codepageByLanguageId = {
    // Arabic_*
    [0x0401]: 'CP1256',
    // Chinese_Taiwan_Stroke_*
    // Chinese_Traditional_Stroke_Count_*
    // Chinese_Taiwan_Bopomofo_*
    // Chinese_Traditional_Bopomofo_*
    [0x0404]: 'CP950',
    // Czech_*
    [0x0405]: 'CP1250',
    // Danish_Greenlandic_*
    // Danish_Norwegian_*
    [0x0406]: 'CP1252',
    // Greek_*
    [0x0408]: 'CP1253',
    // Latin1_General_*
    [0x0409]: 'CP1252',
    // Traditional_Spanish_*
    [0x040A]: 'CP1252',
    // Finnish_Swedish_*
    [0x040B]: 'CP1252',
    // French_*
    [0x040C]: 'CP1252',
    // Hebrew_*
    [0x040D]: 'CP1255',
    // Hungarian_*
    // Hungarian_Technical_*
    [0x040E]: 'CP1250',
    // Icelandic_*
    [0x040F]: 'CP1252',
    // Japanese_*
    // Japanese_XJIS_*
    // Japanese_Unicode_*
    // Japanese_Bushu_Kakusu_*
    [0x0411]: 'CP932',
    // Korean_*
    // Korean_Wansung_*
    [0x0412]: 'CP949',
    // Norwegian_*
    [0x0414]: 'CP1252',
    // Polish_*
    [0x0415]: 'CP1250',
    // Romansh_*
    [0x0417]: 'CP1252',
    // Romanian_*
    [0x0418]: 'CP1250',
    // Cyrillic_*
    [0x0419]: 'CP1251',
    // Croatian_*
    [0x041A]: 'CP1250',
    // Slovak_*
    [0x041B]: 'CP1250',
    // Albanian_*
    [0x041C]: 'CP1250',
    // Thai_*
    [0x041E]: 'CP874',
    // Turkish_*
    [0x041F]: 'CP1254',
    // Urdu_*
    [0x0420]: 'CP1256',
    // Ukrainian_*
    [0x0422]: 'CP1251',
    // Slovenian_*
    [0x0424]: 'CP1250',
    // Estonian_*
    [0x0425]: 'CP1257',
    // Latvian_*
    [0x0426]: 'CP1257',
    // Lithuanian_*
    [0x0427]: 'CP1257',
    // Persian_*
    [0x0429]: 'CP1256',
    // Vietnamese_*
    [0x042A]: 'CP1258',
    // Azeri_Latin_*
    [0x042C]: 'CP1254',
    // Upper_Sorbian_*
    [0x042E]: 'CP1252',
    // Macedonian_FYROM_*
    [0x042F]: 'CP1251',
    // Sami_Norway_*
    [0x043B]: 'CP1252',
    // Kazakh_*
    [0x043F]: 'CP1251',
    // Turkmen_*
    [0x0442]: 'CP1250',
    // Uzbek_Latin_*
    [0x0443]: 'CP1254',
    // Tatar_*
    [0x0444]: 'CP1251',
    // Welsh_*
    [0x0452]: 'CP1252',
    // Frisian_*
    [0x0462]: 'CP1252',
    // Bashkir_*
    [0x046D]: 'CP1251',
    // Mapudungan_*
    [0x047A]: 'CP1252',
    // Mohawk_*
    [0x047C]: 'CP1252',
    // Breton_*
    [0x047E]: 'CP1252',
    // Uighur_*
    [0x0480]: 'CP1256',
    // Corsican_*
    [0x0483]: 'CP1252',
    // Yakut_*
    [0x0485]: 'CP1251',
    // Dari_*
    [0x048C]: 'CP1256',
    // Chinese_PRC_*
    // Chinese_Simplified_Pinyin_*
    // Chinese_PRC_Stroke_*
    // Chinese_Simplified_Stroke_Order_*
    [0x0804]: 'CP936',
    // Serbian_Latin_*
    [0x081A]: 'CP1250',
    // Azeri_Cyrillic_*
    [0x082C]: 'CP1251',
    // Sami_Sweden_Finland_*
    [0x083B]: 'CP1252',
    // Tamazight_*
    [0x085F]: 'CP1252',
    // Chinese_Hong_Kong_Stroke_*
    [0x0C04]: 'CP950',
    // Modern_Spanish_*
    [0x0C0A]: 'CP1252',
    // Serbian_Cyrillic_*
    [0x0C1A]: 'CP1251',
    // Chinese_Traditional_Pinyin_*
    // Chinese_Traditional_Stroke_Order_*
    [0x1404]: 'CP950',
    // Bosnian_Latin_*
    [0x141A]: 'CP1250',
    // Bosnian_Cyrillic_*
    [0x201A]: 'CP1251',
    // German
    // German_PhoneBook_*
    [0x0407]: 'CP1252',
    // Georgian_Modern_Sort_*
    [0x0437]: 'CP1252'
};
const codepageBySortId = exports.codepageBySortId = {
    [30]: 'CP437',
    // SQL_Latin1_General_CP437_BIN
    [31]: 'CP437',
    // SQL_Latin1_General_CP437_CS_AS
    [32]: 'CP437',
    // SQL_Latin1_General_CP437_CI_AS
    [33]: 'CP437',
    // SQL_Latin1_General_Pref_CP437_CI_AS
    [34]: 'CP437',
    // SQL_Latin1_General_CP437_CI_AI
    [40]: 'CP850',
    // SQL_Latin1_General_CP850_BIN
    [41]: 'CP850',
    // SQL_Latin1_General_CP850_CS_AS
    [42]: 'CP850',
    // SQL_Latin1_General_CP850_CI_AS
    [43]: 'CP850',
    // SQL_Latin1_General_Pref_CP850_CI_AS
    [44]: 'CP850',
    // SQL_Latin1_General_CP850_CI_AI
    [49]: 'CP850',
    // SQL_1xCompat_CP850_CI_AS
    [51]: 'CP1252',
    // SQL_Latin1_General_Cp1_CS_AS_KI_WI
    [52]: 'CP1252',
    // SQL_Latin1_General_Cp1_CI_AS_KI_WI
    [53]: 'CP1252',
    // SQL_Latin1_General_Pref_Cp1_CI_AS_KI_WI
    [54]: 'CP1252',
    // SQL_Latin1_General_Cp1_CI_AI_KI_WI
    [55]: 'CP850',
    // SQL_AltDiction_CP850_CS_AS
    [56]: 'CP850',
    // SQL_AltDiction_Pref_CP850_CI_AS
    [57]: 'CP850',
    // SQL_AltDiction_CP850_CI_AI
    [58]: 'CP850',
    // SQL_Scandinavian_Pref_CP850_CI_AS
    [59]: 'CP850',
    // SQL_Scandinavian_CP850_CS_AS
    [60]: 'CP850',
    // SQL_Scandinavian_CP850_CI_AS
    [61]: 'CP850',
    // SQL_AltDiction_CP850_CI_AS
    [80]: 'CP1250',
    // SQL_Latin1_General_1250_BIN
    [81]: 'CP1250',
    // SQL_Latin1_General_CP1250_CS_AS
    [82]: 'CP1250',
    // SQL_Latin1_General_Cp1250_CI_AS_KI_WI
    [83]: 'CP1250',
    // SQL_Czech_Cp1250_CS_AS_KI_WI
    [84]: 'CP1250',
    // SQL_Czech_Cp1250_CI_AS_KI_WI
    [85]: 'CP1250',
    // SQL_Hungarian_Cp1250_CS_AS_KI_WI
    [86]: 'CP1250',
    // SQL_Hungarian_Cp1250_CI_AS_KI_WI
    [87]: 'CP1250',
    // SQL_Polish_Cp1250_CS_AS_KI_WI
    [88]: 'CP1250',
    // SQL_Polish_Cp1250_CI_AS_KI_WI
    [89]: 'CP1250',
    // SQL_Romanian_Cp1250_CS_AS_KI_WI
    [90]: 'CP1250',
    // SQL_Romanian_Cp1250_CI_AS_KI_WI
    [91]: 'CP1250',
    // SQL_Croatian_Cp1250_CS_AS_KI_WI
    [92]: 'CP1250',
    // SQL_Croatian_Cp1250_CI_AS_KI_WI
    [93]: 'CP1250',
    // SQL_Slovak_Cp1250_CS_AS_KI_WI
    [94]: 'CP1250',
    // SQL_Slovak_Cp1250_CI_AS_KI_WI
    [95]: 'CP1250',
    // SQL_Slovenian_Cp1250_CS_AS_KI_WI
    [96]: 'CP1250',
    // SQL_Slovenian_Cp1250_CI_AS_KI_WI
    [104]: 'CP1251',
    // SQL_Latin1_General_1251_BIN
    [105]: 'CP1251',
    // SQL_Latin1_General_CP1251_CS_AS
    [106]: 'CP1251',
    // SQL_Latin1_General_CP1251_CI_AS
    [107]: 'CP1251',
    // SQL_Ukrainian_Cp1251_CS_AS_KI_WI
    [108]: 'CP1251',
    // SQL_Ukrainian_Cp1251_CI_AS_KI_WI
    [112]: 'CP1253',
    // SQL_Latin1_General_1253_BIN
    [113]: 'CP1253',
    // SQL_Latin1_General_CP1253_CS_AS
    [114]: 'CP1253',
    // SQL_Latin1_General_CP1253_CI_AS
    [120]: 'CP1253',
    // SQL_MixDiction_CP1253_CS_AS
    [121]: 'CP1253',
    // SQL_AltDiction_CP1253_CS_AS
    [122]: 'CP1253',
    // SQL_AltDiction2_CP1253_CS_AS
    [124]: 'CP1253',
    // SQL_Latin1_General_CP1253_CI_AI
    [128]: 'CP1254',
    // SQL_Latin1_General_1254_BIN
    [129]: 'CP1254',
    // SQL_Latin1_General_Cp1254_CS_AS_KI_WI
    [130]: 'CP1254',
    // SQL_Latin1_General_Cp1254_CI_AS_KI_WI
    [136]: 'CP1255',
    // SQL_Latin1_General_1255_BIN
    [137]: 'CP1255',
    // SQL_Latin1_General_CP1255_CS_AS
    [138]: 'CP1255',
    // SQL_Latin1_General_CP1255_CI_AS
    [144]: 'CP1256',
    // SQL_Latin1_General_1256_BIN
    [145]: 'CP1256',
    // SQL_Latin1_General_CP1256_CS_AS
    [146]: 'CP1256',
    // SQL_Latin1_General_CP1256_CI_AS
    [152]: 'CP1257',
    // SQL_Latin1_General_1257_BIN
    [153]: 'CP1257',
    // SQL_Latin1_General_CP1257_CS_AS
    [154]: 'CP1257',
    // SQL_Latin1_General_CP1257_CI_AS
    [155]: 'CP1257',
    // SQL_Estonian_Cp1257_CS_AS_KI_WI
    [156]: 'CP1257',
    // SQL_Estonian_Cp1257_CI_AS_KI_WI
    [157]: 'CP1257',
    // SQL_Latvian_Cp1257_CS_AS_KI_WI
    [158]: 'CP1257',
    // SQL_Latvian_Cp1257_CI_AS_KI_WI
    [159]: 'CP1257',
    // SQL_Lithuanian_Cp1257_CS_AS_KI_WI
    [160]: 'CP1257',
    // SQL_Lithuanian_Cp1257_CI_AS_KI_WI
    [183]: 'CP1252',
    // SQL_Danish_Pref_Cp1_CI_AS_KI_WI
    [184]: 'CP1252',
    // SQL_SwedishPhone_Pref_Cp1_CI_AS_KI_WI
    [185]: 'CP1252',
    // SQL_SwedishStd_Pref_Cp1_CI_AS_KI_WI
    [186]: 'CP1252' // SQL_Icelandic_Pref_Cp1_CI_AS_KI_WI
};
const Flags = exports.Flags = {
    IGNORE_CASE: 1 << 0,
    IGNORE_ACCENT: 1 << 1,
    IGNORE_KANA: 1 << 2,
    IGNORE_WIDTH: 1 << 3,
    BINARY: 1 << 4,
    BINARY2: 1 << 5,
    UTF8: 1 << 6
};
class Collation {
    static fromBuffer(buffer, offset = 0) {
        let lcid = (buffer[offset + 2] & 0x0F) << 16;
        lcid |= buffer[offset + 1] << 8;
        lcid |= buffer[offset + 0];
        let flags = (buffer[offset + 3] & 0x0F) << 4;
        flags |= (buffer[offset + 2] & 0xF0) >>> 4;
        const version = (buffer[offset + 3] & 0xF0) >>> 4;
        const sortId = buffer[offset + 4];
        return new this(lcid, flags, version, sortId);
    }
    constructor(lcid, flags, version, sortId){
        this.buffer = undefined;
        this.lcid = lcid;
        this.flags = flags;
        this.version = version;
        this.sortId = sortId;
        if (this.flags & Flags.UTF8) {
            this.codepage = 'utf-8';
        } else if (this.sortId) {
            this.codepage = codepageBySortId[this.sortId];
        } else {
            // The last 16 bits of the LCID are the language id.
            // The first 4 bits define additional sort orders.
            const languageId = this.lcid & 0xFFFF;
            this.codepage = codepageByLanguageId[languageId];
        }
    }
    toBuffer() {
        if (this.buffer) {
            return this.buffer;
        }
        this.buffer = Buffer.alloc(5);
        this.buffer[0] = this.lcid & 0xFF;
        this.buffer[1] = this.lcid >>> 8 & 0xFF;
        this.buffer[2] = this.lcid >>> 16 & 0x0F | (this.flags & 0x0F) << 4;
        this.buffer[3] = (this.flags & 0xF0) >>> 4 | (this.version & 0x0F) << 4;
        this.buffer[4] = this.sortId & 0xFF;
        return this.buffer;
    }
}
exports.Collation = Collation; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb2RlcGFnZUJ5TGFuZ3VhZ2VJZCIsImV4cG9ydHMiLCJjb2RlcGFnZUJ5U29ydElkIiwiRmxhZ3MiLCJJR05PUkVfQ0FTRSIsIklHTk9SRV9BQ0NFTlQiLCJJR05PUkVfS0FOQSIsIklHTk9SRV9XSURUSCIsIkJJTkFSWSIsIkJJTkFSWTIiLCJVVEY4IiwiQ29sbGF0aW9uIiwiZnJvbUJ1ZmZlciIsImJ1ZmZlciIsIm9mZnNldCIsImxjaWQiLCJmbGFncyIsInZlcnNpb24iLCJzb3J0SWQiLCJjb25zdHJ1Y3RvciIsInVuZGVmaW5lZCIsImNvZGVwYWdlIiwibGFuZ3VhZ2VJZCIsInRvQnVmZmVyIiwiQnVmZmVyIiwiYWxsb2MiXSwic291cmNlcyI6WyIuLi9zcmMvY29sbGF0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbInR5cGUgRW5jb2RpbmcgPSAndXRmLTgnIHwgJ0NQNDM3JyB8ICdDUDg1MCcgfCAnQ1A4NzQnIHwgJ0NQOTMyJyB8ICdDUDkzNicgfCAnQ1A5NDknIHwgJ0NQOTUwJyB8ICdDUDEyNTAnIHwgJ0NQMTI1MScgfCAnQ1AxMjUyJyB8ICdDUDEyNTMnIHwgJ0NQMTI1NCcgfCAnQ1AxMjU1JyB8ICdDUDEyNTYnIHwgJ0NQMTI1NycgfCAnQ1AxMjU4JztcblxuLy8gaHR0cDovL3RlY2huZXQubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2FhMTc2NTUzKHY9c3FsLjgwKS5hc3B4XG5leHBvcnQgY29uc3QgY29kZXBhZ2VCeUxhbmd1YWdlSWQ6IHsgW2tleTogbnVtYmVyXTogRW5jb2RpbmcgfSA9IHtcbiAgLy8gQXJhYmljXypcbiAgWzB4MDQwMV06ICdDUDEyNTYnLFxuXG4gIC8vIENoaW5lc2VfVGFpd2FuX1N0cm9rZV8qXG4gIC8vIENoaW5lc2VfVHJhZGl0aW9uYWxfU3Ryb2tlX0NvdW50XypcbiAgLy8gQ2hpbmVzZV9UYWl3YW5fQm9wb21vZm9fKlxuICAvLyBDaGluZXNlX1RyYWRpdGlvbmFsX0JvcG9tb2ZvXypcbiAgWzB4MDQwNF06ICdDUDk1MCcsXG5cbiAgLy8gQ3plY2hfKlxuICBbMHgwNDA1XTogJ0NQMTI1MCcsXG5cbiAgLy8gRGFuaXNoX0dyZWVubGFuZGljXypcbiAgLy8gRGFuaXNoX05vcndlZ2lhbl8qXG4gIFsweDA0MDZdOiAnQ1AxMjUyJyxcblxuICAvLyBHcmVla18qXG4gIFsweDA0MDhdOiAnQ1AxMjUzJyxcblxuICAvLyBMYXRpbjFfR2VuZXJhbF8qXG4gIFsweDA0MDldOiAnQ1AxMjUyJyxcblxuICAvLyBUcmFkaXRpb25hbF9TcGFuaXNoXypcbiAgWzB4MDQwQV06ICdDUDEyNTInLFxuXG4gIC8vIEZpbm5pc2hfU3dlZGlzaF8qXG4gIFsweDA0MEJdOiAnQ1AxMjUyJyxcblxuICAvLyBGcmVuY2hfKlxuICBbMHgwNDBDXTogJ0NQMTI1MicsXG5cbiAgLy8gSGVicmV3XypcbiAgWzB4MDQwRF06ICdDUDEyNTUnLFxuXG4gIC8vIEh1bmdhcmlhbl8qXG4gIC8vIEh1bmdhcmlhbl9UZWNobmljYWxfKlxuICBbMHgwNDBFXTogJ0NQMTI1MCcsXG5cbiAgLy8gSWNlbGFuZGljXypcbiAgWzB4MDQwRl06ICdDUDEyNTInLFxuXG4gIC8vIEphcGFuZXNlXypcbiAgLy8gSmFwYW5lc2VfWEpJU18qXG4gIC8vIEphcGFuZXNlX1VuaWNvZGVfKlxuICAvLyBKYXBhbmVzZV9CdXNodV9LYWt1c3VfKlxuICBbMHgwNDExXTogJ0NQOTMyJyxcblxuICAvLyBLb3JlYW5fKlxuICAvLyBLb3JlYW5fV2Fuc3VuZ18qXG4gIFsweDA0MTJdOiAnQ1A5NDknLFxuXG4gIC8vIE5vcndlZ2lhbl8qXG4gIFsweDA0MTRdOiAnQ1AxMjUyJyxcblxuICAvLyBQb2xpc2hfKlxuICBbMHgwNDE1XTogJ0NQMTI1MCcsXG5cbiAgLy8gUm9tYW5zaF8qXG4gIFsweDA0MTddOiAnQ1AxMjUyJyxcblxuICAvLyBSb21hbmlhbl8qXG4gIFsweDA0MThdOiAnQ1AxMjUwJyxcblxuICAvLyBDeXJpbGxpY18qXG4gIFsweDA0MTldOiAnQ1AxMjUxJyxcblxuICAvLyBDcm9hdGlhbl8qXG4gIFsweDA0MUFdOiAnQ1AxMjUwJyxcblxuICAvLyBTbG92YWtfKlxuICBbMHgwNDFCXTogJ0NQMTI1MCcsXG5cbiAgLy8gQWxiYW5pYW5fKlxuICBbMHgwNDFDXTogJ0NQMTI1MCcsXG5cbiAgLy8gVGhhaV8qXG4gIFsweDA0MUVdOiAnQ1A4NzQnLFxuXG4gIC8vIFR1cmtpc2hfKlxuICBbMHgwNDFGXTogJ0NQMTI1NCcsXG5cbiAgLy8gVXJkdV8qXG4gIFsweDA0MjBdOiAnQ1AxMjU2JyxcblxuICAvLyBVa3JhaW5pYW5fKlxuICBbMHgwNDIyXTogJ0NQMTI1MScsXG5cbiAgLy8gU2xvdmVuaWFuXypcbiAgWzB4MDQyNF06ICdDUDEyNTAnLFxuXG4gIC8vIEVzdG9uaWFuXypcbiAgWzB4MDQyNV06ICdDUDEyNTcnLFxuXG4gIC8vIExhdHZpYW5fKlxuICBbMHgwNDI2XTogJ0NQMTI1NycsXG5cbiAgLy8gTGl0aHVhbmlhbl8qXG4gIFsweDA0MjddOiAnQ1AxMjU3JyxcblxuICAvLyBQZXJzaWFuXypcbiAgWzB4MDQyOV06ICdDUDEyNTYnLFxuXG4gIC8vIFZpZXRuYW1lc2VfKlxuICBbMHgwNDJBXTogJ0NQMTI1OCcsXG5cbiAgLy8gQXplcmlfTGF0aW5fKlxuICBbMHgwNDJDXTogJ0NQMTI1NCcsXG5cbiAgLy8gVXBwZXJfU29yYmlhbl8qXG4gIFsweDA0MkVdOiAnQ1AxMjUyJyxcblxuICAvLyBNYWNlZG9uaWFuX0ZZUk9NXypcbiAgWzB4MDQyRl06ICdDUDEyNTEnLFxuXG4gIC8vIFNhbWlfTm9yd2F5XypcbiAgWzB4MDQzQl06ICdDUDEyNTInLFxuXG4gIC8vIEthemFraF8qXG4gIFsweDA0M0ZdOiAnQ1AxMjUxJyxcblxuICAvLyBUdXJrbWVuXypcbiAgWzB4MDQ0Ml06ICdDUDEyNTAnLFxuXG4gIC8vIFV6YmVrX0xhdGluXypcbiAgWzB4MDQ0M106ICdDUDEyNTQnLFxuXG4gIC8vIFRhdGFyXypcbiAgWzB4MDQ0NF06ICdDUDEyNTEnLFxuXG4gIC8vIFdlbHNoXypcbiAgWzB4MDQ1Ml06ICdDUDEyNTInLFxuXG4gIC8vIEZyaXNpYW5fKlxuICBbMHgwNDYyXTogJ0NQMTI1MicsXG5cbiAgLy8gQmFzaGtpcl8qXG4gIFsweDA0NkRdOiAnQ1AxMjUxJyxcblxuICAvLyBNYXB1ZHVuZ2FuXypcbiAgWzB4MDQ3QV06ICdDUDEyNTInLFxuXG4gIC8vIE1vaGF3a18qXG4gIFsweDA0N0NdOiAnQ1AxMjUyJyxcblxuICAvLyBCcmV0b25fKlxuICBbMHgwNDdFXTogJ0NQMTI1MicsXG5cbiAgLy8gVWlnaHVyXypcbiAgWzB4MDQ4MF06ICdDUDEyNTYnLFxuXG4gIC8vIENvcnNpY2FuXypcbiAgWzB4MDQ4M106ICdDUDEyNTInLFxuXG4gIC8vIFlha3V0XypcbiAgWzB4MDQ4NV06ICdDUDEyNTEnLFxuXG4gIC8vIERhcmlfKlxuICBbMHgwNDhDXTogJ0NQMTI1NicsXG5cbiAgLy8gQ2hpbmVzZV9QUkNfKlxuICAvLyBDaGluZXNlX1NpbXBsaWZpZWRfUGlueWluXypcbiAgLy8gQ2hpbmVzZV9QUkNfU3Ryb2tlXypcbiAgLy8gQ2hpbmVzZV9TaW1wbGlmaWVkX1N0cm9rZV9PcmRlcl8qXG4gIFsweDA4MDRdOiAnQ1A5MzYnLFxuXG4gIC8vIFNlcmJpYW5fTGF0aW5fKlxuICBbMHgwODFBXTogJ0NQMTI1MCcsXG5cbiAgLy8gQXplcmlfQ3lyaWxsaWNfKlxuICBbMHgwODJDXTogJ0NQMTI1MScsXG5cbiAgLy8gU2FtaV9Td2VkZW5fRmlubGFuZF8qXG4gIFsweDA4M0JdOiAnQ1AxMjUyJyxcblxuICAvLyBUYW1hemlnaHRfKlxuICBbMHgwODVGXTogJ0NQMTI1MicsXG5cbiAgLy8gQ2hpbmVzZV9Ib25nX0tvbmdfU3Ryb2tlXypcbiAgWzB4MEMwNF06ICdDUDk1MCcsXG5cbiAgLy8gTW9kZXJuX1NwYW5pc2hfKlxuICBbMHgwQzBBXTogJ0NQMTI1MicsXG5cbiAgLy8gU2VyYmlhbl9DeXJpbGxpY18qXG4gIFsweDBDMUFdOiAnQ1AxMjUxJyxcblxuICAvLyBDaGluZXNlX1RyYWRpdGlvbmFsX1Bpbnlpbl8qXG4gIC8vIENoaW5lc2VfVHJhZGl0aW9uYWxfU3Ryb2tlX09yZGVyXypcbiAgWzB4MTQwNF06ICdDUDk1MCcsXG5cbiAgLy8gQm9zbmlhbl9MYXRpbl8qXG4gIFsweDE0MUFdOiAnQ1AxMjUwJyxcblxuICAvLyBCb3NuaWFuX0N5cmlsbGljXypcbiAgWzB4MjAxQV06ICdDUDEyNTEnLFxuXG4gIC8vIEdlcm1hblxuICAvLyBHZXJtYW5fUGhvbmVCb29rXypcbiAgWzB4MDQwN106ICdDUDEyNTInLFxuXG4gIC8vIEdlb3JnaWFuX01vZGVybl9Tb3J0XypcbiAgWzB4MDQzN106ICdDUDEyNTInXG59O1xuXG5leHBvcnQgY29uc3QgY29kZXBhZ2VCeVNvcnRJZDogeyBba2V5OiBudW1iZXJdOiBFbmNvZGluZyB9ID0ge1xuICBbMzBdOiAnQ1A0MzcnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ1A0MzdfQklOXG4gIFszMV06ICdDUDQzNycsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DUDQzN19DU19BU1xuICBbMzJdOiAnQ1A0MzcnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ1A0MzdfQ0lfQVNcbiAgWzMzXTogJ0NQNDM3JywgLy8gU1FMX0xhdGluMV9HZW5lcmFsX1ByZWZfQ1A0MzdfQ0lfQVNcbiAgWzM0XTogJ0NQNDM3JywgLy8gU1FMX0xhdGluMV9HZW5lcmFsX0NQNDM3X0NJX0FJXG4gIFs0MF06ICdDUDg1MCcsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DUDg1MF9CSU5cbiAgWzQxXTogJ0NQODUwJywgLy8gU1FMX0xhdGluMV9HZW5lcmFsX0NQODUwX0NTX0FTXG4gIFs0Ml06ICdDUDg1MCcsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DUDg1MF9DSV9BU1xuICBbNDNdOiAnQ1A4NTAnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfUHJlZl9DUDg1MF9DSV9BU1xuICBbNDRdOiAnQ1A4NTAnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ1A4NTBfQ0lfQUlcbiAgWzQ5XTogJ0NQODUwJywgLy8gU1FMXzF4Q29tcGF0X0NQODUwX0NJX0FTXG4gIFs1MV06ICdDUDEyNTInLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ3AxX0NTX0FTX0tJX1dJXG4gIFs1Ml06ICdDUDEyNTInLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ3AxX0NJX0FTX0tJX1dJXG4gIFs1M106ICdDUDEyNTInLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfUHJlZl9DcDFfQ0lfQVNfS0lfV0lcbiAgWzU0XTogJ0NQMTI1MicsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DcDFfQ0lfQUlfS0lfV0lcbiAgWzU1XTogJ0NQODUwJywgLy8gU1FMX0FsdERpY3Rpb25fQ1A4NTBfQ1NfQVNcbiAgWzU2XTogJ0NQODUwJywgLy8gU1FMX0FsdERpY3Rpb25fUHJlZl9DUDg1MF9DSV9BU1xuICBbNTddOiAnQ1A4NTAnLCAvLyBTUUxfQWx0RGljdGlvbl9DUDg1MF9DSV9BSVxuICBbNThdOiAnQ1A4NTAnLCAvLyBTUUxfU2NhbmRpbmF2aWFuX1ByZWZfQ1A4NTBfQ0lfQVNcbiAgWzU5XTogJ0NQODUwJywgLy8gU1FMX1NjYW5kaW5hdmlhbl9DUDg1MF9DU19BU1xuICBbNjBdOiAnQ1A4NTAnLCAvLyBTUUxfU2NhbmRpbmF2aWFuX0NQODUwX0NJX0FTXG4gIFs2MV06ICdDUDg1MCcsIC8vIFNRTF9BbHREaWN0aW9uX0NQODUwX0NJX0FTXG4gIFs4MF06ICdDUDEyNTAnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfMTI1MF9CSU5cbiAgWzgxXTogJ0NQMTI1MCcsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DUDEyNTBfQ1NfQVNcbiAgWzgyXTogJ0NQMTI1MCcsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DcDEyNTBfQ0lfQVNfS0lfV0lcbiAgWzgzXTogJ0NQMTI1MCcsIC8vIFNRTF9DemVjaF9DcDEyNTBfQ1NfQVNfS0lfV0lcbiAgWzg0XTogJ0NQMTI1MCcsIC8vIFNRTF9DemVjaF9DcDEyNTBfQ0lfQVNfS0lfV0lcbiAgWzg1XTogJ0NQMTI1MCcsIC8vIFNRTF9IdW5nYXJpYW5fQ3AxMjUwX0NTX0FTX0tJX1dJXG4gIFs4Nl06ICdDUDEyNTAnLCAvLyBTUUxfSHVuZ2FyaWFuX0NwMTI1MF9DSV9BU19LSV9XSVxuICBbODddOiAnQ1AxMjUwJywgLy8gU1FMX1BvbGlzaF9DcDEyNTBfQ1NfQVNfS0lfV0lcbiAgWzg4XTogJ0NQMTI1MCcsIC8vIFNRTF9Qb2xpc2hfQ3AxMjUwX0NJX0FTX0tJX1dJXG4gIFs4OV06ICdDUDEyNTAnLCAvLyBTUUxfUm9tYW5pYW5fQ3AxMjUwX0NTX0FTX0tJX1dJXG4gIFs5MF06ICdDUDEyNTAnLCAvLyBTUUxfUm9tYW5pYW5fQ3AxMjUwX0NJX0FTX0tJX1dJXG4gIFs5MV06ICdDUDEyNTAnLCAvLyBTUUxfQ3JvYXRpYW5fQ3AxMjUwX0NTX0FTX0tJX1dJXG4gIFs5Ml06ICdDUDEyNTAnLCAvLyBTUUxfQ3JvYXRpYW5fQ3AxMjUwX0NJX0FTX0tJX1dJXG4gIFs5M106ICdDUDEyNTAnLCAvLyBTUUxfU2xvdmFrX0NwMTI1MF9DU19BU19LSV9XSVxuICBbOTRdOiAnQ1AxMjUwJywgLy8gU1FMX1Nsb3Zha19DcDEyNTBfQ0lfQVNfS0lfV0lcbiAgWzk1XTogJ0NQMTI1MCcsIC8vIFNRTF9TbG92ZW5pYW5fQ3AxMjUwX0NTX0FTX0tJX1dJXG4gIFs5Nl06ICdDUDEyNTAnLCAvLyBTUUxfU2xvdmVuaWFuX0NwMTI1MF9DSV9BU19LSV9XSVxuICBbMTA0XTogJ0NQMTI1MScsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF8xMjUxX0JJTlxuICBbMTA1XTogJ0NQMTI1MScsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DUDEyNTFfQ1NfQVNcbiAgWzEwNl06ICdDUDEyNTEnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ1AxMjUxX0NJX0FTXG4gIFsxMDddOiAnQ1AxMjUxJywgLy8gU1FMX1VrcmFpbmlhbl9DcDEyNTFfQ1NfQVNfS0lfV0lcbiAgWzEwOF06ICdDUDEyNTEnLCAvLyBTUUxfVWtyYWluaWFuX0NwMTI1MV9DSV9BU19LSV9XSVxuICBbMTEyXTogJ0NQMTI1MycsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF8xMjUzX0JJTlxuICBbMTEzXTogJ0NQMTI1MycsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DUDEyNTNfQ1NfQVNcbiAgWzExNF06ICdDUDEyNTMnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ1AxMjUzX0NJX0FTXG4gIFsxMjBdOiAnQ1AxMjUzJywgLy8gU1FMX01peERpY3Rpb25fQ1AxMjUzX0NTX0FTXG4gIFsxMjFdOiAnQ1AxMjUzJywgLy8gU1FMX0FsdERpY3Rpb25fQ1AxMjUzX0NTX0FTXG4gIFsxMjJdOiAnQ1AxMjUzJywgLy8gU1FMX0FsdERpY3Rpb24yX0NQMTI1M19DU19BU1xuICBbMTI0XTogJ0NQMTI1MycsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DUDEyNTNfQ0lfQUlcbiAgWzEyOF06ICdDUDEyNTQnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfMTI1NF9CSU5cbiAgWzEyOV06ICdDUDEyNTQnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ3AxMjU0X0NTX0FTX0tJX1dJXG4gIFsxMzBdOiAnQ1AxMjU0JywgLy8gU1FMX0xhdGluMV9HZW5lcmFsX0NwMTI1NF9DSV9BU19LSV9XSVxuICBbMTM2XTogJ0NQMTI1NScsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF8xMjU1X0JJTlxuICBbMTM3XTogJ0NQMTI1NScsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DUDEyNTVfQ1NfQVNcbiAgWzEzOF06ICdDUDEyNTUnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ1AxMjU1X0NJX0FTXG4gIFsxNDRdOiAnQ1AxMjU2JywgLy8gU1FMX0xhdGluMV9HZW5lcmFsXzEyNTZfQklOXG4gIFsxNDVdOiAnQ1AxMjU2JywgLy8gU1FMX0xhdGluMV9HZW5lcmFsX0NQMTI1Nl9DU19BU1xuICBbMTQ2XTogJ0NQMTI1NicsIC8vIFNRTF9MYXRpbjFfR2VuZXJhbF9DUDEyNTZfQ0lfQVNcbiAgWzE1Ml06ICdDUDEyNTcnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfMTI1N19CSU5cbiAgWzE1M106ICdDUDEyNTcnLCAvLyBTUUxfTGF0aW4xX0dlbmVyYWxfQ1AxMjU3X0NTX0FTXG4gIFsxNTRdOiAnQ1AxMjU3JywgLy8gU1FMX0xhdGluMV9HZW5lcmFsX0NQMTI1N19DSV9BU1xuICBbMTU1XTogJ0NQMTI1NycsIC8vIFNRTF9Fc3Rvbmlhbl9DcDEyNTdfQ1NfQVNfS0lfV0lcbiAgWzE1Nl06ICdDUDEyNTcnLCAvLyBTUUxfRXN0b25pYW5fQ3AxMjU3X0NJX0FTX0tJX1dJXG4gIFsxNTddOiAnQ1AxMjU3JywgLy8gU1FMX0xhdHZpYW5fQ3AxMjU3X0NTX0FTX0tJX1dJXG4gIFsxNThdOiAnQ1AxMjU3JywgLy8gU1FMX0xhdHZpYW5fQ3AxMjU3X0NJX0FTX0tJX1dJXG4gIFsxNTldOiAnQ1AxMjU3JywgLy8gU1FMX0xpdGh1YW5pYW5fQ3AxMjU3X0NTX0FTX0tJX1dJXG4gIFsxNjBdOiAnQ1AxMjU3JywgLy8gU1FMX0xpdGh1YW5pYW5fQ3AxMjU3X0NJX0FTX0tJX1dJXG4gIFsxODNdOiAnQ1AxMjUyJywgLy8gU1FMX0RhbmlzaF9QcmVmX0NwMV9DSV9BU19LSV9XSVxuICBbMTg0XTogJ0NQMTI1MicsIC8vIFNRTF9Td2VkaXNoUGhvbmVfUHJlZl9DcDFfQ0lfQVNfS0lfV0lcbiAgWzE4NV06ICdDUDEyNTInLCAvLyBTUUxfU3dlZGlzaFN0ZF9QcmVmX0NwMV9DSV9BU19LSV9XSVxuICBbMTg2XTogJ0NQMTI1MicgLy8gU1FMX0ljZWxhbmRpY19QcmVmX0NwMV9DSV9BU19LSV9XSVxufTtcblxuZXhwb3J0IGNvbnN0IEZsYWdzID0ge1xuICBJR05PUkVfQ0FTRTogMSA8PCAwLFxuICBJR05PUkVfQUNDRU5UOiAxIDw8IDEsXG4gIElHTk9SRV9LQU5BOiAxIDw8IDIsXG4gIElHTk9SRV9XSURUSDogMSA8PCAzLFxuICBCSU5BUlk6IDEgPDwgNCxcbiAgQklOQVJZMjogMSA8PCA1LFxuICBVVEY4OiAxIDw8IDYsXG59O1xuXG5leHBvcnQgY2xhc3MgQ29sbGF0aW9uIHtcbiAgZGVjbGFyZSByZWFkb25seSBsY2lkOiBudW1iZXI7XG4gIGRlY2xhcmUgcmVhZG9ubHkgZmxhZ3M6IG51bWJlcjtcbiAgZGVjbGFyZSByZWFkb25seSB2ZXJzaW9uOiBudW1iZXI7XG4gIGRlY2xhcmUgcmVhZG9ubHkgc29ydElkOiBudW1iZXI7XG4gIGRlY2xhcmUgcmVhZG9ubHkgY29kZXBhZ2U6IEVuY29kaW5nIHwgdW5kZWZpbmVkO1xuXG4gIGRlY2xhcmUgcHJpdmF0ZSBidWZmZXI6IEJ1ZmZlciB8IHVuZGVmaW5lZDtcblxuICBzdGF0aWMgZnJvbUJ1ZmZlcihidWZmZXI6IEJ1ZmZlciwgb2Zmc2V0ID0gMCkge1xuICAgIGxldCBsY2lkID0gKGJ1ZmZlcltvZmZzZXQgKyAyXSAmIDB4MEYpIDw8IDE2O1xuICAgIGxjaWQgfD0gYnVmZmVyW29mZnNldCArIDFdIDw8IDg7XG4gICAgbGNpZCB8PSBidWZmZXJbb2Zmc2V0ICsgMF07XG5cbiAgICBsZXQgZmxhZ3MgPSAoYnVmZmVyW29mZnNldCArIDNdICYgMHgwRikgPDwgNDtcbiAgICBmbGFncyB8PSAoYnVmZmVyW29mZnNldCArIDJdICYgMHhGMCkgPj4+IDQ7XG5cbiAgICBjb25zdCB2ZXJzaW9uID0gKGJ1ZmZlcltvZmZzZXQgKyAzXSAmIDB4RjApID4+PiA0O1xuXG4gICAgY29uc3Qgc29ydElkID0gYnVmZmVyW29mZnNldCArIDRdO1xuXG4gICAgcmV0dXJuIG5ldyB0aGlzKGxjaWQsIGZsYWdzLCB2ZXJzaW9uLCBzb3J0SWQpO1xuICB9XG5cbiAgY29uc3RydWN0b3IobGNpZDogbnVtYmVyLCBmbGFnczogbnVtYmVyLCB2ZXJzaW9uOiBudW1iZXIsIHNvcnRJZDogbnVtYmVyKSB7XG4gICAgdGhpcy5idWZmZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLmxjaWQgPSBsY2lkO1xuICAgIHRoaXMuZmxhZ3MgPSBmbGFncztcbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICAgIHRoaXMuc29ydElkID0gc29ydElkO1xuXG4gICAgaWYgKHRoaXMuZmxhZ3MgJiBGbGFncy5VVEY4KSB7XG4gICAgICB0aGlzLmNvZGVwYWdlID0gJ3V0Zi04JztcbiAgICB9IGVsc2UgaWYgKHRoaXMuc29ydElkKSB7XG4gICAgICB0aGlzLmNvZGVwYWdlID0gY29kZXBhZ2VCeVNvcnRJZFt0aGlzLnNvcnRJZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFRoZSBsYXN0IDE2IGJpdHMgb2YgdGhlIExDSUQgYXJlIHRoZSBsYW5ndWFnZSBpZC5cbiAgICAgIC8vIFRoZSBmaXJzdCA0IGJpdHMgZGVmaW5lIGFkZGl0aW9uYWwgc29ydCBvcmRlcnMuXG4gICAgICBjb25zdCBsYW5ndWFnZUlkID0gdGhpcy5sY2lkICYgMHhGRkZGO1xuICAgICAgdGhpcy5jb2RlcGFnZSA9IGNvZGVwYWdlQnlMYW5ndWFnZUlkW2xhbmd1YWdlSWRdO1xuICAgIH1cbiAgfVxuXG4gIHRvQnVmZmVyKCk6IEJ1ZmZlciB7XG4gICAgaWYgKHRoaXMuYnVmZmVyKSB7XG4gICAgICByZXR1cm4gdGhpcy5idWZmZXI7XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXIgPSBCdWZmZXIuYWxsb2MoNSk7XG5cbiAgICB0aGlzLmJ1ZmZlclswXSA9IHRoaXMubGNpZCAmIDB4RkY7XG4gICAgdGhpcy5idWZmZXJbMV0gPSAodGhpcy5sY2lkID4+PiA4KSAmIDB4RkY7XG4gICAgdGhpcy5idWZmZXJbMl0gPSAoKHRoaXMubGNpZCA+Pj4gMTYpICYgMHgwRikgfCAoKHRoaXMuZmxhZ3MgJiAweDBGKSA8PCA0KTtcbiAgICB0aGlzLmJ1ZmZlclszXSA9ICgodGhpcy5mbGFncyAmIDB4RjApID4+PiA0KSB8ICgodGhpcy52ZXJzaW9uICYgMHgwRikgPDwgNCk7XG4gICAgdGhpcy5idWZmZXJbNF0gPSB0aGlzLnNvcnRJZCAmIDB4RkY7XG5cbiAgICByZXR1cm4gdGhpcy5idWZmZXI7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBRUE7QUFDTyxNQUFNQSxvQkFBaUQsR0FBQUMsT0FBQSxDQUFBRCxvQkFBQSxHQUFHO0VBQy9EO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBO0VBQ0E7RUFDQTtFQUNBLENBQUMsTUFBTSxHQUFHLE9BQU87RUFFakI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0E7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0E7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBO0VBQ0E7RUFDQTtFQUNBLENBQUMsTUFBTSxHQUFHLE9BQU87RUFFakI7RUFDQTtFQUNBLENBQUMsTUFBTSxHQUFHLE9BQU87RUFFakI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLE9BQU87RUFFakI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQTtFQUNBO0VBQ0E7RUFDQSxDQUFDLE1BQU0sR0FBRyxPQUFPO0VBRWpCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBLENBQUMsTUFBTSxHQUFHLE9BQU87RUFFakI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsUUFBUTtFQUVsQjtFQUNBO0VBQ0EsQ0FBQyxNQUFNLEdBQUcsT0FBTztFQUVqQjtFQUNBLENBQUMsTUFBTSxHQUFHLFFBQVE7RUFFbEI7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0E7RUFDQSxDQUFDLE1BQU0sR0FBRyxRQUFRO0VBRWxCO0VBQ0EsQ0FBQyxNQUFNLEdBQUc7QUFDWixDQUFDO0FBRU0sTUFBTUUsZ0JBQTZDLEdBQUFELE9BQUEsQ0FBQUMsZ0JBQUEsR0FBRztFQUMzRCxDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxPQUFPO0VBQUU7RUFDZixDQUFDLEVBQUUsR0FBRyxRQUFRO0VBQUU7RUFDaEIsQ0FBQyxFQUFFLEdBQUcsUUFBUTtFQUFFO0VBQ2hCLENBQUMsRUFBRSxHQUFHLFFBQVE7RUFBRTtFQUNoQixDQUFDLEVBQUUsR0FBRyxRQUFRO0VBQUU7RUFDaEIsQ0FBQyxFQUFFLEdBQUcsT0FBTztFQUFFO0VBQ2YsQ0FBQyxFQUFFLEdBQUcsT0FBTztFQUFFO0VBQ2YsQ0FBQyxFQUFFLEdBQUcsT0FBTztFQUFFO0VBQ2YsQ0FBQyxFQUFFLEdBQUcsT0FBTztFQUFFO0VBQ2YsQ0FBQyxFQUFFLEdBQUcsT0FBTztFQUFFO0VBQ2YsQ0FBQyxFQUFFLEdBQUcsT0FBTztFQUFFO0VBQ2YsQ0FBQyxFQUFFLEdBQUcsT0FBTztFQUFFO0VBQ2YsQ0FBQyxFQUFFLEdBQUcsUUFBUTtFQUFFO0VBQ2hCLENBQUMsRUFBRSxHQUFHLFFBQVE7RUFBRTtFQUNoQixDQUFDLEVBQUUsR0FBRyxRQUFRO0VBQUU7RUFDaEIsQ0FBQyxFQUFFLEdBQUcsUUFBUTtFQUFFO0VBQ2hCLENBQUMsRUFBRSxHQUFHLFFBQVE7RUFBRTtFQUNoQixDQUFDLEVBQUUsR0FBRyxRQUFRO0VBQUU7RUFDaEIsQ0FBQyxFQUFFLEdBQUcsUUFBUTtFQUFFO0VBQ2hCLENBQUMsRUFBRSxHQUFHLFFBQVE7RUFBRTtFQUNoQixDQUFDLEVBQUUsR0FBRyxRQUFRO0VBQUU7RUFDaEIsQ0FBQyxFQUFFLEdBQUcsUUFBUTtFQUFFO0VBQ2hCLENBQUMsRUFBRSxHQUFHLFFBQVE7RUFBRTtFQUNoQixDQUFDLEVBQUUsR0FBRyxRQUFRO0VBQUU7RUFDaEIsQ0FBQyxFQUFFLEdBQUcsUUFBUTtFQUFFO0VBQ2hCLENBQUMsRUFBRSxHQUFHLFFBQVE7RUFBRTtFQUNoQixDQUFDLEVBQUUsR0FBRyxRQUFRO0VBQUU7RUFDaEIsQ0FBQyxFQUFFLEdBQUcsUUFBUTtFQUFFO0VBQ2hCLENBQUMsRUFBRSxHQUFHLFFBQVE7RUFBRTtFQUNoQixDQUFDLEdBQUcsR0FBRyxRQUFRO0VBQUU7RUFDakIsQ0FBQyxHQUFHLEdBQUcsUUFBUTtFQUFFO0VBQ2pCLENBQUMsR0FBRyxHQUFHLFFBQVE7RUFBRTtFQUNqQixDQUFDLEdBQUcsR0FBRyxRQUFRO0VBQUU7RUFDakIsQ0FBQyxHQUFHLEdBQUcsUUFBUTtFQUFFO0VBQ2pCLENBQUMsR0FBRyxHQUFHLFFBQVE7RUFBRTtFQUNqQixDQUFDLEdBQUcsR0FBRyxRQUFRO0VBQUU7RUFDakIsQ0FBQyxHQUFHLEdBQUcsUUFBUTtFQUFFO0VBQ2pCLENBQUMsR0FBRyxHQUFHLFFBQVE7RUFBRTtFQUNqQixDQUFDLEdBQUcsR0FB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Q0FBQ0MsS0FBSyxHQUFHQSxLQUFLO0lBQ2xCLElBQUksQ0FBQ0MsT0FBTyxHQUFHQSxPQUFPO0lBQ3RCLElBQUksQ0FBQ0MsTUFBTSxHQUFHQSxNQUFNO0lBRXBCLElBQUksSUFBSSxDQUFDRixLQUFLLEdBQUdiLEtBQUssQ0FBQ08sSUFBSSxFQUFFO01BQzNCLElBQUksQ0FBQ1csUUFBUSxHQUFHLE9BQU87SUFDekIsQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDSCxNQUFNLEVBQUU7TUFDdEIsSUFBSSxDQUFDRyxRQUFRLEdBQUduQixnQkFBZ0IsQ0FBQyxJQUFJLENBQUNnQixNQUFNLENBQUM7SUFDL0MsQ0FBQyxNQUFNO01BQ0w7TUFDQTtNQUNBLE1BQU1JLFVBQVUsR0FBRyxJQUFJLENBQUNQLElBQUksR0FBRyxNQUFNO01BQ3JDLElBQUksQ0FBQ00sUUFBUSxHQUFHckIsb0JBQW9CLENBQUNzQixVQUFVLENBQUM7SUFDbEQ7RUFDRjtFQUVBQyxRQUFRQSxDQUFBLEVBQVc7SUFDakIsSUFBSSxJQUFJLENBQUNWLE1BQU0sRUFBRTtNQUNmLE9BQU8sSUFBSSxDQUFDQSxNQUFNO0lBQ3BCO0lBRUEsSUFBSSxDQUFDQSxNQUFNLEdBQUdXLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUU3QixJQUFJLENBQUNaLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUNFLElBQUksR0FBRyxJQUFJO0lBQ2pDLElBQUksQ0FBQ0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFJLElBQUksQ0FBQ0UsSUFBSSxLQUFLLENBQUMsR0FBSSxJQUFJO0lBQ3pDLElBQUksQ0FBQ0YsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFLLElBQUksQ0FBQ0UsSUFBSSxLQUFLLEVBQUUsR0FBSSxJQUFJLEdBQUssQ0FBQyxJQUFJLENBQUNDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBRTtJQUN6RSxJQUFJLENBQUNILE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBSSxDQUFDLElBQUksQ0FBQ0csS0FBSyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUssQ0FBQyxJQUFJLENBQUNDLE9BQU8sR0FBRyxJQUFJLEtBQUssQ0FBRTtJQUMzRSxJQUFJLENBQUNKLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUNLLE1BQU0sR0FBRyxJQUFJO0lBRW5DLE9BQU8sSUFBSSxDQUFDTCxNQUFNO0VBQ3BCO0FBQ0Y7QUFBQ1osT0FBQSxDQUFBVSxTQUFBLEdBQUFBLFNBQUEiLCJpZ25vcmVMaXN0IjpbXX0=
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/guid-parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bufferToLowerCaseGuid = bufferToLowerCaseGuid;
exports.bufferToUpperCaseGuid = bufferToUpperCaseGuid;
exports.guidToArray = guidToArray;
const UPPER_CASE_MAP = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '0A',
    '0B',
    '0C',
    '0D',
    '0E',
    '0F',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '1A',
    '1B',
    '1C',
    '1D',
    '1E',
    '1F',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '2A',
    '2B',
    '2C',
    '2D',
    '2E',
    '2F',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '3A',
    '3B',
    '3C',
    '3D',
    '3E',
    '3F',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '4A',
    '4B',
    '4C',
    '4D',
    '4E',
    '4F',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '58',
    '59',
    '5A',
    '5B',
    '5C',
    '5D',
    '5E',
    '5F',
    '60',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '6A',
    '6B',
    '6C',
    '6D',
    '6E',
    '6F',
    '70',
    '71',
    '72',
    '73',
    '74',
    '75',
    '76',
    '77',
    '78',
    '79',
    '7A',
    '7B',
    '7C',
    '7D',
    '7E',
    '7F',
    '80',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '8A',
    '8B',
    '8C',
    '8D',
    '8E',
    '8F',
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99',
    '9A',
    '9B',
    '9C',
    '9D',
    '9E',
    '9F',
    'A0',
    'A1',
    'A2',
    'A3',
    'A4',
    'A5',
    'A6',
    'A7',
    'A8',
    'A9',
    'AA',
    'AB',
    'AC',
    'AD',
    'AE',
    'AF',
    'B0',
    'B1',
    'B2',
    'B3',
    'B4',
    'B5',
    'B6',
    'B7',
    'B8',
    'B9',
    'BA',
    'BB',
    'BC',
    'BD',
    'BE',
    'BF',
    'C0',
    'C1',
    'C2',
    'C3',
    'C4',
    'C5',
    'C6',
    'C7',
    'C8',
    'C9',
    'CA',
    'CB',
    'CC',
    'CD',
    'CE',
    'CF',
    'D0',
    'D1',
    'D2',
    'D3',
    'D4',
    'D5',
    'D6',
    'D7',
    'D8',
    'D9',
    'DA',
    'DB',
    'DC',
    'DD',
    'DE',
    'DF',
    'E0',
    'E1',
    'E2',
    'E3',
    'E4',
    'E5',
    'E6',
    'E7',
    'E8',
    'E9',
    'EA',
    'EB',
    'EC',
    'ED',
    'EE',
    'EF',
    'F0',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'FA',
    'FB',
    'FC',
    'FD',
    'FE',
    'FF'
];
const LOWER_CASE_MAP = [
    '00',
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '0a',
    '0b',
    '0c',
    '0d',
    '0e',
    '0f',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '1a',
    '1b',
    '1c',
    '1d',
    '1e',
    '1f',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '26',
    '27',
    '28',
    '29',
    '2a',
    '2b',
    '2c',
    '2d',
    '2e',
    '2f',
    '30',
    '31',
    '32',
    '33',
    '34',
    '35',
    '36',
    '37',
    '38',
    '39',
    '3a',
    '3b',
    '3c',
    '3d',
    '3e',
    '3f',
    '40',
    '41',
    '42',
    '43',
    '44',
    '45',
    '46',
    '47',
    '48',
    '49',
    '4a',
    '4b',
    '4c',
    '4d',
    '4e',
    '4f',
    '50',
    '51',
    '52',
    '53',
    '54',
    '55',
    '56',
    '57',
    '58',
    '59',
    '5a',
    '5b',
    '5c',
    '5d',
    '5e',
    '5f',
    '60',
    '61',
    '62',
    '63',
    '64',
    '65',
    '66',
    '67',
    '68',
    '69',
    '6a',
    '6b',
    '6c',
    '6d',
    '6e',
    '6f',
    '70',
    '71',
    '72',
    '73',
    '74',
    '75',
    '76',
    '77',
    '78',
    '79',
    '7a',
    '7b',
    '7c',
    '7d',
    '7e',
    '7f',
    '80',
    '81',
    '82',
    '83',
    '84',
    '85',
    '86',
    '87',
    '88',
    '89',
    '8a',
    '8b',
    '8c',
    '8d',
    '8e',
    '8f',
    '90',
    '91',
    '92',
    '93',
    '94',
    '95',
    '96',
    '97',
    '98',
    '99',
    '9a',
    '9b',
    '9c',
    '9d',
    '9e',
    '9f',
    'a0',
    'a1',
    'a2',
    'a3',
    'a4',
    'a5',
    'a6',
    'a7',
    'a8',
    'a9',
    'aa',
    'ab',
    'ac',
    'ad',
    'ae',
    'af',
    'b0',
    'b1',
    'b2',
    'b3',
    'b4',
    'b5',
    'b6',
    'b7',
    'b8',
    'b9',
    'ba',
    'bb',
    'bc',
    'bd',
    'be',
    'bf',
    'c0',
    'c1',
    'c2',
    'c3',
    'c4',
    'c5',
    'c6',
    'c7',
    'c8',
    'c9',
    'ca',
    'cb',
    'cc',
    'cd',
    'ce',
    'cf',
    'd0',
    'd1',
    'd2',
    'd3',
    'd4',
    'd5',
    'd6',
    'd7',
    'd8',
    'd9',
    'da',
    'db',
    'dc',
    'dd',
    'de',
    'df',
    'e0',
    'e1',
    'e2',
    'e3',
    'e4',
    'e5',
    'e6',
    'e7',
    'e8',
    'e9',
    'ea',
    'eb',
    'ec',
    'ed',
    'ee',
    'ef',
    'f0',
    'f1',
    'f2',
    'f3',
    'f4',
    'f5',
    'f6',
    'f7',
    'f8',
    'f9',
    'fa',
    'fb',
    'fc',
    'fd',
    'fe',
    'ff'
];
function bufferToUpperCaseGuid(buffer) {
    return UPPER_CASE_MAP[buffer[3]] + UPPER_CASE_MAP[buffer[2]] + UPPER_CASE_MAP[buffer[1]] + UPPER_CASE_MAP[buffer[0]] + '-' + UPPER_CASE_MAP[buffer[5]] + UPPER_CASE_MAP[buffer[4]] + '-' + UPPER_CASE_MAP[buffer[7]] + UPPER_CASE_MAP[buffer[6]] + '-' + UPPER_CASE_MAP[buffer[8]] + UPPER_CASE_MAP[buffer[9]] + '-' + UPPER_CASE_MAP[buffer[10]] + UPPER_CASE_MAP[buffer[11]] + UPPER_CASE_MAP[buffer[12]] + UPPER_CASE_MAP[buffer[13]] + UPPER_CASE_MAP[buffer[14]] + UPPER_CASE_MAP[buffer[15]];
}
function bufferToLowerCaseGuid(buffer) {
    return LOWER_CASE_MAP[buffer[3]] + LOWER_CASE_MAP[buffer[2]] + LOWER_CASE_MAP[buffer[1]] + LOWER_CASE_MAP[buffer[0]] + '-' + LOWER_CASE_MAP[buffer[5]] + LOWER_CASE_MAP[buffer[4]] + '-' + LOWER_CASE_MAP[buffer[7]] + LOWER_CASE_MAP[buffer[6]] + '-' + LOWER_CASE_MAP[buffer[8]] + LOWER_CASE_MAP[buffer[9]] + '-' + LOWER_CASE_MAP[buffer[10]] + LOWER_CASE_MAP[buffer[11]] + LOWER_CASE_MAP[buffer[12]] + LOWER_CASE_MAP[buffer[13]] + LOWER_CASE_MAP[buffer[14]] + LOWER_CASE_MAP[buffer[15]];
}
const CHARCODEMAP = {};
const hexDigits = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F'
].map((d)=>d.charCodeAt(0));
for(let i = 0; i < hexDigits.length; i++){
    const map = CHARCODEMAP[hexDigits[i]] = {};
    for(let j = 0; j < hexDigits.length; j++){
        const hex = String.fromCharCode(hexDigits[i], hexDigits[j]);
        const value = parseInt(hex, 16);
        map[hexDigits[j]] = value;
    }
}
function guidToArray(guid) {
    return [
        CHARCODEMAP[guid.charCodeAt(6)][guid.charCodeAt(7)],
        CHARCODEMAP[guid.charCodeAt(4)][guid.charCodeAt(5)],
        CHARCODEMAP[guid.charCodeAt(2)][guid.charCodeAt(3)],
        CHARCODEMAP[guid.charCodeAt(0)][guid.charCodeAt(1)],
        CHARCODEMAP[guid.charCodeAt(11)][guid.charCodeAt(12)],
        CHARCODEMAP[guid.charCodeAt(9)][guid.charCodeAt(10)],
        CHARCODEMAP[guid.charCodeAt(16)][guid.charCodeAt(17)],
        CHARCODEMAP[guid.charCodeAt(14)][guid.charCodeAt(15)],
        CHARCODEMAP[guid.charCodeAt(19)][guid.charCodeAt(20)],
        CHARCODEMAP[guid.charCodeAt(21)][guid.charCodeAt(22)],
        CHARCODEMAP[guid.charCodeAt(24)][guid.charCodeAt(25)],
        CHARCODEMAP[guid.charCodeAt(26)][guid.charCodeAt(27)],
        CHARCODEMAP[guid.charCodeAt(28)][guid.charCodeAt(29)],
        CHARCODEMAP[guid.charCodeAt(30)][guid.charCodeAt(31)],
        CHARCODEMAP[guid.charCodeAt(32)][guid.charCodeAt(33)],
        CHARCODEMAP[guid.charCodeAt(34)][guid.charCodeAt(35)]
    ];
} //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJVUFBFUl9DQVNFX01BUCIsIkxPV0VSX0NBU0VfTUFQIiwiYnVmZmVyVG9VcHBlckNhc2VHdWlkIiwiYnVmZmVyIiwiYnVmZmVyVG9Mb3dlckNhc2VHdWlkIiwiQ0hBUkNPREVNQVAiLCJoZXhEaWdpdHMiLCJtYXAiLCJkIiwiY2hhckNvZGVBdCIsImkiLCJsZW5ndGgiLCJqIiwiaGV4IiwiU3RyaW5nIiwiZnJvbUNoYXJDb2RlIiwidmFsdWUiLCJwYXJzZUludCIsImd1aWRUb0FycmF5IiwiZ3VpZCJdLCJzb3VyY2VzIjpbIi4uL3NyYy9ndWlkLXBhcnNlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBVUFBFUl9DQVNFX01BUCA9IFtcbiAgJzAwJywgJzAxJywgJzAyJywgJzAzJywgJzA0JywgJzA1JywgJzA2JywgJzA3JywgJzA4JywgJzA5JywgJzBBJywgJzBCJywgJzBDJywgJzBEJywgJzBFJywgJzBGJyxcbiAgJzEwJywgJzExJywgJzEyJywgJzEzJywgJzE0JywgJzE1JywgJzE2JywgJzE3JywgJzE4JywgJzE5JywgJzFBJywgJzFCJywgJzFDJywgJzFEJywgJzFFJywgJzFGJyxcbiAgJzIwJywgJzIxJywgJzIyJywgJzIzJywgJzI0JywgJzI1JywgJzI2JywgJzI3JywgJzI4JywgJzI5JywgJzJBJywgJzJCJywgJzJDJywgJzJEJywgJzJFJywgJzJGJyxcbiAgJzMwJywgJzMxJywgJzMyJywgJzMzJywgJzM0JywgJzM1JywgJzM2JywgJzM3JywgJzM4JywgJzM5JywgJzNBJywgJzNCJywgJzNDJywgJzNEJywgJzNFJywgJzNGJyxcbiAgJzQwJywgJzQxJywgJzQyJywgJzQzJywgJzQ0JywgJzQ1JywgJzQ2JywgJzQ3JywgJzQ4JywgJzQ5JywgJzRBJywgJzRCJywgJzRDJywgJzREJywgJzRFJywgJzRGJyxcbiAgJzUwJywgJzUxJywgJzUyJywgJzUzJywgJzU0JywgJzU1JywgJzU2JywgJzU3JywgJzU4JywgJzU5JywgJzVBJywgJzVCJywgJzVDJywgJzVEJywgJzVFJywgJzVGJyxcbiAgJzYwJywgJzYxJywgJzYyJywgJzYzJywgJzY0JywgJzY1JywgJzY2JywgJzY3JywgJzY4JywgJzY5JywgJzZBJywgJzZCJywgJzZDJywgJzZEJywgJzZFJywgJzZGJyxcbiAgJzcwJywgJzcxJywgJzcyJywgJzczJywgJzc0JywgJzc1JywgJzc2JywgJzc3JywgJzc4JywgJzc5JywgJzdBJywgJzdCJywgJzdDJywgJzdEJywgJzdFJywgJzdGJyxcbiAgJzgwJywgJzgxJywgJzgyJywgJzgzJywgJzg0JywgJzg1JywgJzg2JywgJzg3JywgJzg4JywgJzg5JywgJzhBJywgJzhCJywgJzhDJywgJzhEJywgJzhFJywgJzhGJyxcbiAgJzkwJywgJzkxJywgJzkyJywgJzkzJywgJzk0JywgJzk1JywgJzk2JywgJzk3JywgJzk4JywgJzk5JywgJzlBJywgJzlCJywgJzlDJywgJzlEJywgJzlFJywgJzlGJyxcbiAgJ0EwJywgJ0ExJywgJ0EyJywgJ0EzJywgJ0E0JywgJ0E1JywgJ0E2JywgJ0E3JywgJ0E4JywgJ0E5JywgJ0FBJywgJ0FCJywgJ0FDJywgJ0FEJywgJ0FFJywgJ0FGJyxcbiAgJ0IwJywgJ0IxJywgJ0IyJywgJ0IzJywgJ0I0JywgJ0I1JywgJ0I2JywgJ0I3JywgJ0I4JywgJ0I5JywgJ0JBJywgJ0JCJywgJ0JDJywgJ0JEJywgJ0JFJywgJ0JGJyxcbiAgJ0MwJywgJ0MxJywgJ0MyJywgJ0MzJywgJ0M0JywgJ0M1JywgJ0M2JywgJ0M3JywgJ0M4JywgJ0M5JywgJ0NBJywgJ0NCJywgJ0NDJywgJ0NEJywgJ0NFJywgJ0NGJyxcbiAgJ0QwJywgJ0QxJywgJ0QyJywgJ0QzJywgJ0Q0JywgJ0Q1JywgJ0Q2JywgJ0Q3JywgJ0Q4JywgJ0Q5JywgJ0RBJywgJ0RCJywgJ0RDJywgJ0REJywgJ0RFJywgJ0RGJyxcbiAgJ0UwJywgJ0UxJywgJ0UyJywgJ0UzJywgJ0U0JywgJ0U1JywgJ0U2JywgJ0U3JywgJ0U4JywgJ0U5JywgJ0VBJywgJ0VCJywgJ0VDJywgJ0VEJywgJ0VFJywgJ0VGJyxcbiAgJ0YwJywgJ0YxJywgJ0YyJywgJ0YzJywgJ0Y0JywgJ0Y1JywgJ0Y2JywgJ0Y3JywgJ0Y4JywgJ0Y5JywgJ0ZBJywgJ0ZCJywgJ0ZDJywgJ0ZEJywgJ0ZFJywgJ0ZGJ1xuXTtcblxuY29uc3QgTE9XRVJfQ0FTRV9NQVAgPSBbXG4gICcwMCcsICcwMScsICcwMicsICcwMycsICcwNCcsICcwNScsICcwNicsICcwNycsICcwOCcsICcwOScsICcwYScsICcwYicsICcwYycsICcwZCcsICcwZScsICcwZicsXG4gICcxMCcsICcxMScsICcxMicsICcxMycsICcxNCcsICcxNScsICcxNicsICcxNycsICcxOCcsICcxOScsICcxYScsICcxYicsICcxYycsICcxZCcsICcxZScsICcxZicsXG4gICcyMCcsICcyMScsICcyMicsICcyMycsICcyNCcsICcyNScsICcyNicsICcyNycsICcyOCcsICcyOScsICcyYScsICcyYicsICcyYycsICcyZCcsICcyZScsICcyZicsXG4gICczMCcsICczMScsICczMicsICczMycsICczNCcsICczNScsICczNicsICczNycsICczOCcsICczOScsICczYScsICczYicsICczYycsICczZCcsICczZScsICczZicsXG4gICc0MCcsICc0MScsICc0MicsICc0MycsICc0NCcsICc0NScsICc0NicsICc0NycsICc0OCcsICc0OScsICc0YScsICc0YicsICc0YycsICc0ZCcsICc0ZScsICc0ZicsXG4gICc1MCcsICc1MScsICc1MicsICc1MycsICc1NCcsICc1NScsICc1NicsICc1NycsICc1OCcsICc1OScsICc1YScsICc1YicsICc1YycsICc1ZCcsICc1ZScsICc1ZicsXG4gICc2MCcsICc2MScsICc2MicsICc2MycsICc2NCcsICc2NScsICc2NicsICc2NycsICc2OCcsICc2OScsICc2YScsICc2YicsICc2YycsICc2ZCcsICc2ZScsICc2ZicsXG4gICc3MCcsICc3MScsICc3MicsICc3MycsICc3NCcsICc3NScsICc3NicsICc3NycsICc3OCcsICc3OScsICc3YScsICc3YicsICc3YycsICc3ZCcsICc3ZScsICc3ZicsXG4gICc4MCcsICc4MScsICc4MicsICc4MycsICc4NCcsICc4NScsICc4NicsICc4NycsICc4OCcsICc4OScsICc4YScsICc4YicsICc4YycsICc4ZCcsICc4ZScsICc4ZicsXG4gICc5MCcsICc5MScsICc5MicsICc5MycsICc5NCcsICc5NScsICc5NicsICc5NycsICc5OCcsICc5OScsICc5YScsICc5YicsICc5YycsICc5ZCcsICc5ZScsICc5ZicsXG4gICdhMCcsICdhMScsICdhMicsICdhMycsICdhNCcsICdhNScsICdhNicsICdhNycsICdhOCcsICdhOScsICdhYScsICdhYicsICdhYycsICdhZCcsICdhZScsICdhZicsXG4gICdiMCcsICdiMScsICdiMicsICdiMycsICdiNCcsICdiNScsICdiNicsICdiNycsICdiOCcsICdiOScsICdiYScsICdiYicsICdiYycsICdiZCcsICdiZScsICdiZicsXG4gICdjMCcsICdjMScsICdjMicsICdjMycsICdjNCcsICdjNScsICdjNicsICdjNycsICdjOCcsICdjOScsICdjYScsICdjYicsICdjYycsICdjZCcsICdjZScsICdjZicsXG4gICdkMCcsICdkMScsICdkMicsICdkMycsICdkNCcsICdkNScsICdkNicsICdkNycsICdkOCcsICdkOScsICdkYScsICdkYicsICdkYycsICdkZCcsICdkZScsICdkZicsXG4gICdlMCcsICdlMScsICdlMicsICdlMycsICdlNCcsICdlNScsICdlNicsICdlNycsICdlOCcsICdlOScsICdlYScsICdlYicsICdlYycsICdlZCcsICdlZScsICdlZicsXG4gICdmMCcsICdmMScsICdmMicsICdmMycsICdmNCcsICdmNScsICdmNicsICdmNycsICdmOCcsICdmOScsICdmYScsICdmYicsICdmYycsICdmZCcsICdmZScsICdmZidcbl07XG5cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJUb1VwcGVyQ2FzZUd1aWQoYnVmZmVyOiBCdWZmZXIpIHtcbiAgcmV0dXJuIChcbiAgICBVUFBFUl9DQVNFX01BUFtidWZmZXJbM11dICtcbiAgICBVUFBFUl9DQVNFX01BUFtidWZmZXJbMl1dICtcbiAgICBVUFBFUl9DQVNFX01BUFtidWZmZXJbMV1dICtcbiAgICBVUFBFUl9DQVNFX01BUFtidWZmZXJbMF1dICtcbiAgICAnLScgK1xuICAgIFVQUEVSX0NBU0VfTUFQW2J1ZmZlcls1XV0gK1xuICAgIFVQUEVSX0NBU0VfTUFQW2J1ZmZlcls0XV0gK1xuICAgICctJyArXG4gICAgVVBQRVJfQ0FTRV9NQVBbYnVmZmVyWzddXSArXG4gICAgVVBQRVJfQ0FTRV9NQVBbYnVmZmVyWzZdXSArXG4gICAgJy0nICtcbiAgICBVUFBFUl9DQVNFX01BUFtidWZmZXJbOF1dICtcbiAgICBVUFBFUl9DQVNFX01BUFtidWZmZXJbOV1dICtcbiAgICAnLScgK1xuICAgIFVQUEVSX0NBU0VfTUFQW2J1ZmZlclsxMF1dICtcbiAgICBVUFBFUl9DQVNFX01BUFtidWZmZXJbMTFdXSArXG4gICAgVVBQRVJfQ0FTRV9NQVBbYnVmZmVyWzEyXV0gK1xuICAgIFVQUEVSX0NBU0VfTUFQW2J1ZmZlclsxM11dICtcbiAgICBVUFBFUl9DQVNFX01BUFtidWZmZXJbMTRdXSArXG4gICAgVVBQRVJfQ0FTRV9NQVBbYnVmZmVyWzE1XV1cbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlclRvTG93ZXJDYXNlR3VpZChidWZmZXI6IEJ1ZmZlcikge1xuICByZXR1cm4gKFxuICAgIExPV0VSX0NBU0VfTUFQW2J1ZmZlclszXV0gK1xuICAgIExPV0VSX0NBU0VfTUFQW2J1ZmZlclsyXV0gK1xuICAgIExPV0VSX0NBU0VfTUFQW2J1ZmZlclsxXV0gK1xuICAgIExPV0VSX0NBU0VfTUFQW2J1ZmZlclswXV0gK1xuICAgICctJyArXG4gICAgTE9XRVJfQ0FTRV9NQVBbYnVmZmVyWzVdXSArXG4gICAgTE9XRVJfQ0FTRV9NQVBbYnVmZmVyWzRdXSArXG4gICAgJy0nICtcbiAgICBMT1dFUl9DQVNFX01BUFtidWZmZXJbN11dICtcbiAgICBMT1dFUl9DQVNFX01BUFtidWZmZXJbNl1dICtcbiAgICAnLScgK1xuICAgIExPV0VSX0NBU0VfTUFQW2J1ZmZlcls4XV0gK1xuICAgIExPV0VSX0NBU0VfTUFQW2J1ZmZlcls5XV0gK1xuICAgICctJyArXG4gICAgTE9XRVJfQ0FTRV9NQVBbYnVmZmVyWzEwXV0gK1xuICAgIExPV0VSX0NBU0VfTUFQW2J1ZmZlclsxMV1dICtcbiAgICBMT1dFUl9DQVNFX01BUFtidWZmZXJbMTJdXSArXG4gICAgTE9XRVJfQ0FTRV9NQVBbYnVmZmVyWzEzXV0gK1xuICAgIExPV0VSX0NBU0VfTUFQW2J1ZmZlclsxNF1dICtcbiAgICBMT1dFUl9DQVNFX01BUFtidWZmZXJbMTVdXVxuICApO1xufVxuXG5jb25zdCBDSEFSQ09ERU1BUDogeyBba2V5OiBudW1iZXJdOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9IH0gPSB7fTtcblxuY29uc3QgaGV4RGlnaXRzID0gW1xuICAnMCcsICcxJywgJzInLCAnMycsICc0JywgJzUnLCAnNicsICc3JywgJzgnLCAnOScsXG4gICdhJywgJ2InLCAnYycsICdkJywgJ2UnLCAnZicsXG4gICdBJywgJ0InLCAnQycsICdEJywgJ0UnLCAnRidcbl0ubWFwKChkKSA9PiBkLmNoYXJDb2RlQXQoMCkpO1xuXG5mb3IgKGxldCBpID0gMDsgaSA8IGhleERpZ2l0cy5sZW5ndGg7IGkrKykge1xuICBjb25zdCBtYXA6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSBDSEFSQ09ERU1BUFtoZXhEaWdpdHNbaV1dID0ge307XG4gIGZvciAobGV0IGogPSAwOyBqIDwgaGV4RGlnaXRzLmxlbmd0aDsgaisrKSB7XG4gICAgY29uc3QgaGV4ID0gU3RyaW5nLmZyb21DaGFyQ29kZShoZXhEaWdpdHNbaV0sIGhleERpZ2l0c1tqXSk7XG4gICAgY29uc3QgdmFsdWUgPSBwYXJzZUludChoZXgsIDE2KTtcbiAgICBtYXBbaGV4RGlnaXRzW2pdXSA9IHZhbHVlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBndWlkVG9BcnJheShndWlkOiBzdHJpbmcpIHtcbiAgcmV0dXJuIFtcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoNildW2d1aWQuY2hhckNvZGVBdCg3KV0sXG4gICAgQ0hBUkNPREVNQVBbZ3VpZC5jaGFyQ29kZUF0KDQpXVtndWlkLmNoYXJDb2RlQXQoNSldLFxuICAgIENIQVJDT0RFTUFQW2d1aWQuY2hhckNvZGVBdCgyKV1bZ3VpZC5jaGFyQ29kZUF0KDMpXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMCldW2d1aWQuY2hhckNvZGVBdCgxKV0sXG4gICAgQ0hBUkNPREVNQVBbZ3VpZC5jaGFyQ29kZUF0KDExKV1bZ3VpZC5jaGFyQ29kZUF0KDEyKV0sXG4gICAgQ0hBUkNPREVNQVBbZ3VpZC5jaGFyQ29kZUF0KDkpXVtndWlkLmNoYXJDb2RlQXQoMTApXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMTYpXVtndWlkLmNoYXJDb2RlQXQoMTcpXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMTQpXVtndWlkLmNoYXJDb2RlQXQoMTUpXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMTkpXVtndWlkLmNoYXJDb2RlQXQoMjApXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMjEpXVtndWlkLmNoYXJDb2RlQXQoMjIpXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMjQpXVtndWlkLmNoYXJDb2RlQXQoMjUpXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMjYpXVtndWlkLmNoYXJDb2RlQXQoMjcpXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMjgpXVtndWlkLmNoYXJDb2RlQXQoMjkpXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMzApXVtndWlkLmNoYXJDb2RlQXQoMzEpXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMzIpXVtndWlkLmNoYXJDb2RlQXQoMzMpXSxcbiAgICBDSEFSQ09ERU1BUFtndWlkLmNoYXJDb2RlQXQoMzQpXVtndWlkLmNoYXJDb2RlQXQoMzUpXVxuICBdO1xufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE1BQU1BLGNBQWMsR0FBRyxDQUNyQixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQy9GO0FBRUQsTUFBTUMsY0FBYyxHQUFHLENBQ3JCLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFDOUYsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUM5RixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQzlGLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FDL0Y7QUFFTSxTQUFTQyxxQkFBcUJBLENBQUNDLE1BQWMsRUFBRTtFQUNwRCxPQUNFSCxj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QUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ25ESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3BESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQ3JESixXQUFXLENBQUNjLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNVLElBQUksQ0FBQ1YsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3REO0FBQ0giLCJpZ25vcmVMaXN0IjpbXX0=
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-type.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.typeByName = exports.TYPES = exports.TYPE = void 0;
var _null = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/null.js [app-route] (ecmascript)"));
var _tinyint = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/tinyint.js [app-route] (ecmascript)"));
var _bit = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/bit.js [app-route] (ecmascript)"));
var _smallint = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/smallint.js [app-route] (ecmascript)"));
var _int = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/int.js [app-route] (ecmascript)"));
var _smalldatetime = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/smalldatetime.js [app-route] (ecmascript)"));
var _real = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/real.js [app-route] (ecmascript)"));
var _money = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/money.js [app-route] (ecmascript)"));
var _datetime = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/datetime.js [app-route] (ecmascript)"));
var _float = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/float.js [app-route] (ecmascript)"));
var _decimal = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/decimal.js [app-route] (ecmascript)"));
var _numeric = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/numeric.js [app-route] (ecmascript)"));
var _smallmoney = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/smallmoney.js [app-route] (ecmascript)"));
var _bigint = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/bigint.js [app-route] (ecmascript)"));
var _image = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/image.js [app-route] (ecmascript)"));
var _text = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/text.js [app-route] (ecmascript)"));
var _uniqueidentifier = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/uniqueidentifier.js [app-route] (ecmascript)"));
var _intn = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/intn.js [app-route] (ecmascript)"));
var _ntext = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/ntext.js [app-route] (ecmascript)"));
var _bitn = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/bitn.js [app-route] (ecmascript)"));
var _decimaln = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/decimaln.js [app-route] (ecmascript)"));
var _numericn = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/numericn.js [app-route] (ecmascript)"));
var _floatn = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/floatn.js [app-route] (ecmascript)"));
var _moneyn = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/moneyn.js [app-route] (ecmascript)"));
var _datetimen = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/datetimen.js [app-route] (ecmascript)"));
var _varbinary = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/varbinary.js [app-route] (ecmascript)"));
var _varchar = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/varchar.js [app-route] (ecmascript)"));
var _binary = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/binary.js [app-route] (ecmascript)"));
var _char = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/char.js [app-route] (ecmascript)"));
var _nvarchar = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/nvarchar.js [app-route] (ecmascript)"));
var _nchar = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/nchar.js [app-route] (ecmascript)"));
var _xml = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/xml.js [app-route] (ecmascript)"));
var _time = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/time.js [app-route] (ecmascript)"));
var _date = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/date.js [app-route] (ecmascript)"));
var _datetime2 = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/datetime2.js [app-route] (ecmascript)"));
var _datetimeoffset = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/datetimeoffset.js [app-route] (ecmascript)"));
var _udt = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/udt.js [app-route] (ecmascript)"));
var _tvp = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/tvp.js [app-route] (ecmascript)"));
var _sqlVariant = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-types/sql-variant.js [app-route] (ecmascript)"));
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
const TYPE = exports.TYPE = {
    [_null.default.id]: _null.default,
    [_tinyint.default.id]: _tinyint.default,
    [_bit.default.id]: _bit.default,
    [_smallint.default.id]: _smallint.default,
    [_int.default.id]: _int.default,
    [_smalldatetime.default.id]: _smalldatetime.default,
    [_real.default.id]: _real.default,
    [_money.default.id]: _money.default,
    [_datetime.default.id]: _datetime.default,
    [_float.default.id]: _float.default,
    [_decimal.default.id]: _decimal.default,
    [_numeric.default.id]: _numeric.default,
    [_smallmoney.default.id]: _smallmoney.default,
    [_bigint.default.id]: _bigint.default,
    [_image.default.id]: _image.default,
    [_text.default.id]: _text.default,
    [_uniqueidentifier.default.id]: _uniqueidentifier.default,
    [_intn.default.id]: _intn.default,
    [_ntext.default.id]: _ntext.default,
    [_bitn.default.id]: _bitn.default,
    [_decimaln.default.id]: _decimaln.default,
    [_numericn.default.id]: _numericn.default,
    [_floatn.default.id]: _floatn.default,
    [_moneyn.default.id]: _moneyn.default,
    [_datetimen.default.id]: _datetimen.default,
    [_varbinary.default.id]: _varbinary.default,
    [_varchar.default.id]: _varchar.default,
    [_binary.default.id]: _binary.default,
    [_char.default.id]: _char.default,
    [_nvarchar.default.id]: _nvarchar.default,
    [_nchar.default.id]: _nchar.default,
    [_xml.default.id]: _xml.default,
    [_time.default.id]: _time.default,
    [_date.default.id]: _date.default,
    [_datetime2.default.id]: _datetime2.default,
    [_datetimeoffset.default.id]: _datetimeoffset.default,
    [_udt.default.id]: _udt.default,
    [_tvp.default.id]: _tvp.default,
    [_sqlVariant.default.id]: _sqlVariant.default
};
/**
 * <table>
 * <thead>
 *   <tr>
 *     <th>Type</th>
 *     <th>Constant</th>
 *     <th>JavaScript</th>
 *     <th>Result set</th>
 *     <th>Parameter</th>
 *   </tr>
 * </thead>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="5">Exact numerics</th>
 *   </tr>
 *   <tr>
 *     <td><code>bit</code></td>
 *     <td><code>[[TYPES.Bit]]</code></td>
 *     <td><code>boolean</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>tinyint</code></td>
 *     <td><code>[[TYPES.TinyInt]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>smallint</code></td>
 *     <td><code>[[TYPES.SmallInt]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>int</code></td>
 *     <td><code>[[TYPES.Int]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>bigint</code><sup>1</sup></td>
 *     <td><code>[[TYPES.BigInt]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>numeric</code><sup>2</sup></td>
 *     <td><code>[[TYPES.Numeric]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>decimal</code><sup>2</sup></td>
 *     <td><code>[[TYPES.Decimal]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>smallmoney</code></td>
 *     <td><code>[[TYPES.SmallMoney]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>money</code></td>
 *     <td><code>[[TYPES.Money]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="5">Approximate numerics</th>
 *   </tr>
 *   <tr>
 *     <td><code>float</code></td>
 *     <td><code>[[TYPES.Float]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>real</code></td>
 *     <td><code>[[TYPES.Real]]</code></td>
 *     <td><code>number</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="4">Date and Time</th>
 *   </tr>
 *   <tr>
 *     <td><code>smalldatetime</code></td>
 *     <td><code>[[TYPES.SmallDateTime]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>datetime</code></td>
 *     <td><code>[[TYPES.DateTime]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>datetime2</code></td>
 *     <td><code>[[TYPES.DateTime2]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>datetimeoffset</code></td>
 *     <td><code>[[TYPES.DateTimeOffset]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>time</code></td>
 *     <td><code>[[TYPES.Time]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>date</code></td>
 *     <td><code>[[TYPES.Date]]</code></td>
 *     <td><code>Date</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="4">Character Strings</th>
 *   </tr>
 *   <tr>
 *     <td><code>char</code></td>
 *     <td><code>[[TYPES.Char]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>varchar</code><sup>3</sup></td>
 *     <td><code>[[TYPES.VarChar]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>text</code></td>
 *     <td><code>[[TYPES.Text]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="4">Unicode Strings</th>
 *   </tr>
 *   <tr>
 *     <td><code>nchar</code></td>
 *     <td><code>[[TYPES.NChar]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>nvarchar</code><sup>3</sup></td>
 *     <td><code>[[TYPES.NVarChar]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>ntext</code></td>
 *     <td><code>[[TYPES.NText]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>-</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="5">Binary Strings<sup>4</sup></th>
 *   </tr>
 *   <tr>
 *     <td><code>binary</code></td>
 *     <td><code>[[TYPES.Binary]]</code></td>
 *     <td><code>Buffer</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>varbinary</code></td>
 *     <td><code>[[TYPES.VarBinary]]</code></td>
 *     <td><code>Buffer</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>image</code></td>
 *     <td><code>[[TYPES.Image]]</code></td>
 *     <td><code>Buffer</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 * </tbody>
 *
 * <tbody>
 *   <tr class="group-heading">
 *     <th colspan="5">Other Data Types</th>
 *   </tr>
 *   <tr>
 *     <td><code>TVP</code></td>
 *     <td><code>[[TYPES.TVP]]</code></td>
 *     <td><code>Object</code></td>
 *     <td>-</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>UDT</code></td>
 *     <td><code>[[TYPES.UDT]]</code></td>
 *     <td><code>Buffer</code></td>
 *     <td>✓</td>
 *     <td>-</td>
 *   </tr>
 *   <tr>
 *     <td><code>uniqueidentifier</code><sup>4</sup></td>
 *     <td><code>[[TYPES.UniqueIdentifier]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>✓</td>
 *   </tr>
 *   <tr>
 *     <td><code>variant</code></td>
 *     <td><code>[[TYPES.Variant]]</code></td>
 *     <td><code>any</code></td>
 *     <td>✓</td>
 *     <td>-</td>
 *   </tr>
 *   <tr>
 *     <td><code>xml</code></td>
 *     <td><code>[[TYPES.Xml]]</code></td>
 *     <td><code>string</code></td>
 *     <td>✓</td>
 *     <td>-</td>
 *   </tr>
 * </tbody>
 * </table>
 *
 * <ol>
 *   <li>
 *     <h4>BigInt</h4>
 *     <p>
 *       Values are returned as a string. This is because values can exceed 53 bits of significant data, which is greater than a
 *       Javascript <code>number</code> type can represent as an integer.
 *     </p>
 *   </li>
 *   <li>
 *     <h4>Numerical, Decimal</h4>
 *     <p>
 *       For input parameters, default precision is 18 and default scale is 0. Maximum supported precision is 19.
 *     </p>
 *   </li>
 *   <li>
 *     <h4>VarChar, NVarChar</h4>
 *     <p>
 *       <code>varchar(max)</code> and <code>nvarchar(max)</code> are also supported.
 *     </p>
 *   </li>
 *   <li>
 *     <h4>UniqueIdentifier</h4>
 *     <p>
 *       Values are returned as a 16 byte hexadecimal string.
 *     </p>
 *     <p>
 *       Note that the order of bytes is not the same as the character representation. See
 *       <a href="http://msdn.microsoft.com/en-us/library/ms190215.aspx">Using uniqueidentifier Data</a>
 *       for an example of the different ordering of bytes.
 *     </p>
 *   </li>
 * </ol>
 */ const TYPES = exports.TYPES = {
    TinyInt: _tinyint.default,
    Bit: _bit.default,
    SmallInt: _smallint.default,
    Int: _int.default,
    SmallDateTime: _smalldatetime.default,
    Real: _real.default,
    Money: _money.default,
    DateTime: _datetime.default,
    Float: _float.default,
    Decimal: _decimal.default,
    Numeric: _numeric.default,
    SmallMoney: _smallmoney.default,
    BigInt: _bigint.default,
    Image: _image.default,
    Text: _text.default,
    UniqueIdentifier: _uniqueidentifier.default,
    NText: _ntext.default,
    VarBinary: _varbinary.default,
    VarChar: _varchar.default,
    Binary: _binary.default,
    Char: _char.default,
    NVarChar: _nvarchar.default,
    NChar: _nchar.default,
    Xml: _xml.default,
    Time: _time.default,
    Date: _date.default,
    DateTime2: _datetime2.default,
    DateTimeOffset: _datetimeoffset.default,
    UDT: _udt.default,
    TVP: _tvp.default,
    Variant: _sqlVariant.default
};
const typeByName = exports.typeByName = TYPES; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbnVsbCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3RpbnlpbnQiLCJfYml0IiwiX3NtYWxsaW50IiwiX2ludCIsIl9zbWFsbGRhdGV0aW1lIiwiX3JlYWwiLCJfbW9uZXkiLCJfZGF0ZXRpbWUiLCJfZmxvYXQiLCJfZGVjaW1hbCIsIl9udW1lcmljIiwiX3NtYWxsbW9uZXkiLCJfYmlnaW50IiwiX2ltYWdlIiwiX3RleHQiLCJfdW5pcXVlaWRlbnRpZmllciIsIl9pbnRuIiwiX250ZXh0IiwiX2JpdG4iLCJfZGVjaW1hbG4iLCJfbnVtZXJpY24iLCJfZmxvYXRuIiwiX21vbmV5biIsIl9kYXRldGltZW4iLCJfdmFyYmluYXJ5IiwiX3ZhcmNoYXIiLCJfYmluYXJ5IiwiX2NoYXIiLCJfbnZhcmNoYXIiLCJfbmNoYXIiLCJfeG1sIiwiX3RpbWUiLCJfZGF0ZSIsIl9kYXRldGltZTIiLCJfZGF0ZXRpbWVvZmZzZXQiLCJfdWR0IiwiX3R2cCIsIl9zcWxWYXJpYW50IiwiZSIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiVFlQRSIsImV4cG9ydHMiLCJOdWxsIiwiaWQiLCJUaW55SW50IiwiQml0IiwiU21hbGxJbnQiLCJJbnQiLCJTbWFsbERhdGVUaW1lIiwiUmVhbCIsIk1vbmV5IiwiRGF0ZVRpbWUiLCJGbG9hdCIsIkRlY2ltYWwiLCJOdW1lcmljIiwiU21hbGxNb25leSIsIkJpZ0ludCIsIkltYWdlIiwiVGV4dCIsIlVuaXF1ZUlkZW50aWZpZXIiLCJJbnROIiwiTlRleHQiLCJCaXROIiwiRGVjaW1hbE4iLCJOdW1lcmljTiIsIkZsb2F0TiIsIk1vbmV5TiIsIkRhdGVUaW1lTiIsIlZhckJpbmFyeSIsIlZhckNoYXIiLCJCaW5hcnkiLCJDaGFyIiwiTlZhckNoYXIiLCJOQ2hhciIsIlhtbCIsIlRpbWUiLCJEYXRlIiwiRGF0ZVRpbWUyIiwiRGF0ZVRpbWVPZmZzZXQiLCJVRFQiLCJUVlAiLCJWYXJpYW50IiwiVFlQRVMiLCJ0eXBlQnlOYW1lIl0sInNvdXJjZXMiOlsiLi4vc3JjL2RhdGEtdHlwZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTnVsbCBmcm9tICcuL2RhdGEtdHlwZXMvbnVsbCc7XG5pbXBvcnQgVGlueUludCBmcm9tICcuL2RhdGEtdHlwZXMvdGlueWludCc7XG5pbXBvcnQgQml0IGZyb20gJy4vZGF0YS10eXBlcy9iaXQnO1xuaW1wb3J0IFNtYWxsSW50IGZyb20gJy4vZGF0YS10eXBlcy9zbWFsbGludCc7XG5pbXBvcnQgSW50IGZyb20gJy4vZGF0YS10eXBlcy9pbnQnO1xuaW1wb3J0IFNtYWxsRGF0ZVRpbWUgZnJvbSAnLi9kYXRhLXR5cGVzL3NtYWxsZGF0ZXRpbWUnO1xuaW1wb3J0IFJlYWwgZnJvbSAnLi9kYXRhLXR5cGVzL3JlYWwnO1xuaW1wb3J0IE1vbmV5IGZyb20gJy4vZGF0YS10eXBlcy9tb25leSc7XG5pbXBvcnQgRGF0ZVRpbWUgZnJvbSAnLi9kYXRhLXR5cGVzL2RhdGV0aW1lJztcbmltcG9ydCBGbG9hdCBmcm9tICcuL2RhdGEtdHlwZXMvZmxvYXQnO1xuaW1wb3J0IERlY2ltYWwgZnJvbSAnLi9kYXRhLXR5cGVzL2RlY2ltYWwnO1xuaW1wb3J0IE51bWVyaWMgZnJvbSAnLi9kYXRhLXR5cGVzL251bWVyaWMnO1xuaW1wb3J0IFNtYWxsTW9uZXkgZnJvbSAnLi9kYXRhLXR5cGVzL3NtYWxsbW9uZXknO1xuaW1wb3J0IEJpZ0ludCBmcm9tICcuL2RhdGEtdHlwZXMvYmlnaW50JztcbmltcG9ydCBJbWFnZSBmcm9tICcuL2RhdGEtdHlwZXMvaW1hZ2UnO1xuaW1wb3J0IFRleHQgZnJvbSAnLi9kYXRhLXR5cGVzL3RleHQnO1xuaW1wb3J0IFVuaXF1ZUlkZW50aWZpZXIgZnJvbSAnLi9kYXRhLXR5cGVzL3VuaXF1ZWlkZW50aWZpZXInO1xuaW1wb3J0IEludE4gZnJvbSAnLi9kYXRhLXR5cGVzL2ludG4nO1xuaW1wb3J0IE5UZXh0IGZyb20gJy4vZGF0YS10eXBlcy9udGV4dCc7XG5pbXBvcnQgQml0TiBmcm9tICcuL2RhdGEtdHlwZXMvYml0bic7XG5pbXBvcnQgRGVjaW1hbE4gZnJvbSAnLi9kYXRhLXR5cGVzL2RlY2ltYWxuJztcbmltcG9ydCBOdW1lcmljTiBmcm9tICcuL2RhdGEtdHlwZXMvbnVtZXJpY24nO1xuaW1wb3J0IEZsb2F0TiBmcm9tICcuL2RhdGEtdHlwZXMvZmxvYXRuJztcbmltcG9ydCBNb25leU4gZnJvbSAnLi9kYXRhLXR5cGVzL21vbmV5bic7XG5pbXBvcnQgRGF0ZVRpbWVOIGZyb20gJy4vZGF0YS10eXBlcy9kYXRldGltZW4nO1xuaW1wb3J0IFZhckJpbmFyeSBmcm9tICcuL2RhdGEtdHlwZXMvdmFyYmluYXJ5JztcbmltcG9ydCBWYXJDaGFyIGZyb20gJy4vZGF0YS10eXBlcy92YXJjaGFyJztcbmltcG9ydCBCaW5hcnkgZnJvbSAnLi9kYXRhLXR5cGVzL2JpbmFyeSc7XG5pbXBvcnQgQ2hhciBmcm9tICcuL2RhdGEtdHlwZXMvY2hhcic7XG5pbXBvcnQgTlZhckNoYXIgZnJvbSAnLi9kYXRhLXR5cGVzL252YXJjaGFyJztcbmltcG9ydCBOQ2hhciBmcm9tICcuL2RhdGEtdHlwZXMvbmNoYXInO1xuaW1wb3J0IFhtbCBmcm9tICcuL2RhdGEtdHlwZXMveG1sJztcbmltcG9ydCBUaW1lIGZyb20gJy4vZGF0YS10eXBlcy90aW1lJztcbmltcG9ydCBEYXRlIGZyb20gJy4vZGF0YS10eXBlcy9kYXRlJztcbmltcG9ydCBEYXRlVGltZTIgZnJvbSAnLi9kYXRhLXR5cGVzL2RhdGV0aW1lMic7XG5pbXBvcnQgRGF0ZVRpbWVPZmZzZXQgZnJvbSAnLi9kYXRhLXR5cGVzL2RhdGV0aW1lb2Zmc2V0JztcbmltcG9ydCBVRFQgZnJvbSAnLi9kYXRhLXR5cGVzL3VkdCc7XG5pbXBvcnQgVFZQIGZyb20gJy4vZGF0YS10eXBlcy90dnAnO1xuaW1wb3J0IFZhcmlhbnQgZnJvbSAnLi9kYXRhLXR5cGVzL3NxbC12YXJpYW50JztcbmltcG9ydCB7IHR5cGUgQ3J5cHRvTWV0YWRhdGEgfSBmcm9tICcuL2Fsd2F5cy1lbmNyeXB0ZWQvdHlwZXMnO1xuXG5pbXBvcnQgeyB0eXBlIEludGVybmFsQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICcuL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IHsgQ29sbGF0aW9uIH0gZnJvbSAnLi9jb2xsYXRpb24nO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhcmFtZXRlciB7XG4gIHR5cGU6IERhdGFUeXBlO1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgdmFsdWU6IHVua25vd247XG5cbiAgb3V0cHV0OiBib29sZWFuO1xuICBsZW5ndGg/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIHByZWNpc2lvbj86IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgc2NhbGU/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgbnVsbGFibGU/OiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4gIGZvcmNlRW5jcnlwdD86IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG4gIGNyeXB0b01ldGFkYXRhPzogQ3J5cHRvTWV0YWRhdGEgfCB1bmRlZmluZWQ7XG4gIGVuY3J5cHRlZFZhbD86IEJ1ZmZlciB8IHVuZGVmaW5lZDtcbn1cblxuXG5leHBvcnQgaW50ZXJmYWNlIFBhcmFtZXRlckRhdGE8VCA9IGFueT4ge1xuICBsZW5ndGg/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIHNjYWxlPzogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBwcmVjaXNpb24/OiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgY29sbGF0aW9uPzogQ29sbGF0aW9uIHwgdW5kZWZpbmVkO1xuXG4gIHZhbHVlOiBUO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIERhdGFUeXBlIHtcbiAgaWQ6IG51bWJlcjtcbiAgdHlwZTogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG5cbiAgZGVjbGFyYXRpb24ocGFyYW1ldGVyOiBQYXJhbWV0ZXIpOiBzdHJpbmc7XG4gIGdlbmVyYXRlVHlwZUluZm8ocGFyYW1ldGVyOiBQYXJhbWV0ZXJEYXRhLCBvcHRpb25zOiBJbnRlcm5hbENvbm5lY3Rpb25PcHRpb25zKTogQnVmZmVyO1xuICBnZW5lcmF0ZVBhcmFtZXRlckxlbmd0aChwYXJhbWV0ZXI6IFBhcmFtZXRlckRhdGEsIG9wdGlvbnM6IEludGVybmFsQ29ubmVjdGlvbk9wdGlvbnMpOiBCdWZmZXI7XG4gIGdlbmVyYXRlUGFyYW1ldGVyRGF0YShwYXJhbWV0ZXI6IFBhcmFtZXRlckRhdGEsIG9wdGlvbnM6IEludGVybmFsQ29ubmVjdGlvbk9wdGlvbnMpOiBHZW5lcmF0b3I8QnVmZmVyLCB2b2lkPjtcbiAgdmFsaWRhdGUodmFsdWU6IGFueSwgY29sbGF0aW9uOiBDb2xsYXRpb24gfCB1bmRlZmluZWQsIG9wdGlvbnM/OiBJbnRlcm5hbENvbm5lY3Rpb25PcHRpb25zKTogYW55OyAvLyBUT0RPOiBSZWZhY3RvciAnYW55JyBhbmQgcmVwbGFjZSB3aXRoIG1vcmUgc3BlY2lmaWMgdHlwZS5cblxuICBoYXNUYWJsZU5hbWU/OiBib29sZWFuO1xuXG4gIHJlc29sdmVMZW5ndGg/OiAocGFyYW1ldGVyOiBQYXJhbWV0ZXIpID0+IG51bWJlcjtcbiAgcmVzb2x2ZVByZWNpc2lvbj86IChwYXJhbWV0ZXI6IFBhcmFtZXRlcikgPT4gbnVtYmVyO1xuICByZXNvbHZlU2NhbGU/OiAocGFyYW1ldGVyOiBQYXJhbWV0ZXIpID0+IG51bWJlcjtcbn1cblxuZXhwb3J0IGNvbnN0IFRZUEUgPSB7XG4gIFtOdWxsLmlkXTogTnVsbCxcbiAgW1RpbnlJbnQuaWRdOiBUaW55SW50LFxuICBbQml0LmlkXTogQml0LFxuICBbU21hbGxJbnQuaWRdOiBTbWFsbEludCxcbiAgW0ludC5pZF06IEludCxcbiAgW1NtYWxsRGF0ZVRpbWUuaWRdOiBTbWFsbERhdGVUaW1lLFxuICBbUmVhbC5pZF06IFJlYWwsXG4gIFtNb25leS5pZF06IE1vbmV5LFxuICBbRGF0ZVRpbWUuaWRdOiBEYXRlVGltZSxcbiAgW0Zsb2F0LmlkXTogRmxvYXQsXG4gIFtEZWNpbWFsLmlkXTogRGVjaW1hbCxcbiAgW051bWVyaWMuaWRdOiBOdW1lcmljLFxuICBbU21hbGxNb25leS5pZF06IFNtYWxsTW9uZXksXG4gIFtCaWdJbnQuaWRdOiBCaWdJbnQsXG4gIFtJbWFnZS5pZF06IEltYWdlLFxuICBbVGV4dC5pZF06IFRleHQsXG4gIFtVbmlxdWVJZGVudGlmaWVyLmlkXTogVW5pcXVlSWRlbnRpZmllcixcbiAgW0ludE4uaWRdOiBJbnROLFxuICBbTlRleHQuaWRdOiBOVGV4dCxcbiAgW0JpdE4uaWRdOiBCaXROLFxuICBbRGVjaW1hbE4uaWRdOiBEZWNpbWFsTixcbiAgW051bWVyaWNOLmlkXTogTnVtZXJpY04sXG4gIFtGbG9hdE4uaWRdOiBGbG9hdE4sXG4gIFtNb25leU4uaWRdOiBNb25leU4sXG4gIFtEYXRlVGltZU4uaWRdOiBEYXRlVGltZU4sXG4gIFtWYXJCaW5hcnkuaWRdOiBWYXJCaW5hcnksXG4gIFtWYXJDaGFyLmlkXTogVmFyQ2hhcixcbiAgW0JpbmFyeS5pZF06IEJpbmFyeSxcbiAgW0NoYXIuaWRdOiBDaGFyLFxuICBbTlZhckNoYXIuaWRdOiBOVmFyQ2hhcixcbiAgW05DaGFyLmlkXTogTkNoYXIsXG4gIFtYbWwuaWRdOiBYbWwsXG4gIFtUaW1lLmlkXTogVGltZSxcbiAgW0RhdGUuaWRdOiBEYXRlLFxuICBbRGF0ZVRpbWUyLmlkXTogRGF0ZVRpbWUyLFxuICBbRGF0ZVRpbWVPZmZzZXQuaWRdOiBEYXRlVGltZU9mZnNldCxcbiAgW1VEVC5pZF06IFVEVCxcbiAgW1RWUC5pZF06IFRWUCxcbiAgW1ZhcmlhbnQuaWRdOiBWYXJpYW50LFxufTtcblxuLyoqXG4gKiA8dGFibGU+XG4gKiA8dGhlYWQ+XG4gKiAgIDx0cj5cbiAqICAgICA8dGg+VHlwZTwvdGg+XG4gKiAgICAgPHRoPkNvbnN0YW50PC90aD5cbiAqICAgICA8dGg+SmF2YVNjcmlwdDwvdGg+XG4gKiAgICAgPHRoPlJlc3VsdCBzZXQ8L3RoPlxuICogICAgIDx0aD5QYXJhbWV0ZXI8L3RoPlxuICogICA8L3RyPlxuICogPC90aGVhZD5cbiAqXG4gKiA8dGJvZHk+XG4gKiAgIDx0ciBjbGFzcz1cImdyb3VwLWhlYWRpbmdcIj5cbiAqICAgICA8dGggY29sc3Bhbj1cIjVcIj5FeGFjdCBudW1lcmljczwvdGg+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+Yml0PC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuQml0XV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+Ym9vbGVhbjwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPnRpbnlpbnQ8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5UaW55SW50XV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+bnVtYmVyPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+c21hbGxpbnQ8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5TbWFsbEludF1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPm51bWJlcjwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPmludDwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5bW1RZUEVTLkludF1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPm51bWJlcjwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPmJpZ2ludDwvY29kZT48c3VwPjE8L3N1cD48L3RkPlxuICogICAgIDx0ZD48Y29kZT5bW1RZUEVTLkJpZ0ludF1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPnN0cmluZzwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPm51bWVyaWM8L2NvZGU+PHN1cD4yPC9zdXA+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5OdW1lcmljXV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+bnVtYmVyPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+ZGVjaW1hbDwvY29kZT48c3VwPjI8L3N1cD48L3RkPlxuICogICAgIDx0ZD48Y29kZT5bW1RZUEVTLkRlY2ltYWxdXTwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5udW1iZXI8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0ZD48Y29kZT5zbWFsbG1vbmV5PC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuU21hbGxNb25leV1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPm51bWJlcjwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPm1vbmV5PC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuTW9uZXldXTwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5udW1iZXI8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgPC90cj5cbiAqIDwvdGJvZHk+XG4gKlxuICogPHRib2R5PlxuICogICA8dHIgY2xhc3M9XCJncm91cC1oZWFkaW5nXCI+XG4gKiAgICAgPHRoIGNvbHNwYW49XCI1XCI+QXBwcm94aW1hdGUgbnVtZXJpY3M8L3RoPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPmZsb2F0PC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuRmxvYXRdXTwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5udW1iZXI8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0ZD48Y29kZT5yZWFsPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuUmVhbF1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPm51bWJlcjwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogPC90Ym9keT5cbiAqXG4gKiA8dGJvZHk+XG4gKiAgIDx0ciBjbGFzcz1cImdyb3VwLWhlYWRpbmdcIj5cbiAqICAgICA8dGggY29sc3Bhbj1cIjRcIj5EYXRlIGFuZCBUaW1lPC90aD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0ZD48Y29kZT5zbWFsbGRhdGV0aW1lPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuU21hbGxEYXRlVGltZV1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPkRhdGU8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0ZD48Y29kZT5kYXRldGltZTwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5bW1RZUEVTLkRhdGVUaW1lXV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+RGF0ZTwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPmRhdGV0aW1lMjwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5bW1RZUEVTLkRhdGVUaW1lMl1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPkRhdGU8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0ZD48Y29kZT5kYXRldGltZW9mZnNldDwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5bW1RZUEVTLkRhdGVUaW1lT2Zmc2V0XV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+RGF0ZTwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPnRpbWU8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5UaW1lXV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+RGF0ZTwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPmRhdGU8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5EYXRlXV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+RGF0ZTwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogPC90Ym9keT5cbiAqXG4gKiA8dGJvZHk+XG4gKiAgIDx0ciBjbGFzcz1cImdyb3VwLWhlYWRpbmdcIj5cbiAqICAgICA8dGggY29sc3Bhbj1cIjRcIj5DaGFyYWN0ZXIgU3RyaW5nczwvdGg+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+Y2hhcjwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5bW1RZUEVTLkNoYXJdXTwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5zdHJpbmc8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0ZD48Y29kZT52YXJjaGFyPC9jb2RlPjxzdXA+Mzwvc3VwPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuVmFyQ2hhcl1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPnN0cmluZzwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPnRleHQ8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5UZXh0XV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+c3RyaW5nPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiA8L3Rib2R5PlxuICpcbiAqIDx0Ym9keT5cbiAqICAgPHRyIGNsYXNzPVwiZ3JvdXAtaGVhZGluZ1wiPlxuICogICAgIDx0aCBjb2xzcGFuPVwiNFwiPlVuaWNvZGUgU3RyaW5nczwvdGg+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+bmNoYXI8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5OQ2hhcl1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPnN0cmluZzwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPm52YXJjaGFyPC9jb2RlPjxzdXA+Mzwvc3VwPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuTlZhckNoYXJdXTwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5zdHJpbmc8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0ZD48Y29kZT5udGV4dDwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5bW1RZUEVTLk5UZXh0XV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+c3RyaW5nPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgICAgPHRkPi08L3RkPlxuICogICA8L3RyPlxuICogPC90Ym9keT5cbiAqXG4gKiA8dGJvZHk+XG4gKiAgIDx0ciBjbGFzcz1cImdyb3VwLWhlYWRpbmdcIj5cbiAqICAgICA8dGggY29sc3Bhbj1cIjVcIj5CaW5hcnkgU3RyaW5nczxzdXA+NDwvc3VwPjwvdGg+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+YmluYXJ5PC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuQmluYXJ5XV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+QnVmZmVyPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+dmFyYmluYXJ5PC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuVmFyQmluYXJ5XV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+QnVmZmVyPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+aW1hZ2U8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5JbWFnZV1dPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPkJ1ZmZlcjwvY29kZT48L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICAgIDx0ZD7inJM8L3RkPlxuICogICA8L3RyPlxuICogPC90Ym9keT5cbiAqXG4gKiA8dGJvZHk+XG4gKiAgIDx0ciBjbGFzcz1cImdyb3VwLWhlYWRpbmdcIj5cbiAqICAgICA8dGggY29sc3Bhbj1cIjVcIj5PdGhlciBEYXRhIFR5cGVzPC90aD5cbiAqICAgPC90cj5cbiAqICAgPHRyPlxuICogICAgIDx0ZD48Y29kZT5UVlA8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5UVlBdXTwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5PYmplY3Q8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+LTwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+VURUPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuVURUXV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+QnVmZmVyPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgICAgPHRkPi08L3RkPlxuICogICA8L3RyPlxuICogICA8dHI+XG4gKiAgICAgPHRkPjxjb2RlPnVuaXF1ZWlkZW50aWZpZXI8L2NvZGU+PHN1cD40PC9zdXA+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+W1tUWVBFUy5VbmlxdWVJZGVudGlmaWVyXV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+c3RyaW5nPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+dmFyaWFudDwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5bW1RZUEVTLlZhcmlhbnRdXTwvY29kZT48L3RkPlxuICogICAgIDx0ZD48Y29kZT5hbnk8L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+4pyTPC90ZD5cbiAqICAgICA8dGQ+LTwvdGQ+XG4gKiAgIDwvdHI+XG4gKiAgIDx0cj5cbiAqICAgICA8dGQ+PGNvZGU+eG1sPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPjxjb2RlPltbVFlQRVMuWG1sXV08L2NvZGU+PC90ZD5cbiAqICAgICA8dGQ+PGNvZGU+c3RyaW5nPC9jb2RlPjwvdGQ+XG4gKiAgICAgPHRkPuKckzwvdGQ+XG4gKiAgICAgPHRkPi08L3RkPlxuICogICA8L3RyPlxuICogPC90Ym9keT5cbiAqIDwvdGFibGU+XG4gKlxuICogPG9sPlxuICogICA8bGk+XG4gKiAgICAgPGg0PkJpZ0ludDwvaDQ+XG4gKiAgICAgPHA+XG4gKiAgICAgICBWYWx1ZXMgYXJlIHJldHVybmVkIGFzIGEgc3RyaW5nLiBUaGlzIGlzIGJlY2F1c2UgdmFsdWVzIGNhbiBleGNlZWQgNTMgYml0cyBvZiBzaWduaWZpY2FudCBkYXRhLCB3aGljaCBpcyBncmVhdGVyIHRoYW4gYVxuICogICAgICAgSmF2YXNjcmlwdCA8Y29kZT5udW1iZXI8L2NvZGU+IHR5cGUgY2FuIHJlcHJlc2VudCBhcyBhbiBpbnRlZ2VyLlxuICogICAgIDwvcD5cbiAqICAgPC9saT5cbiAqICAgPGxpPlxuICogICAgIDxoND5OdW1lcmljYWwsIERlY2ltYWw8L2g0PlxuICogICAgIDxwPlxuICogICAgICAgRm9yIGlucHV0IHBhcmFtZXRlcnMsIGRlZmF1bHQgcHJlY2lzaW9uIGlzIDE4IGFuZCBkZWZhdWx0IHNjYWxlIGlzIDAuIE1heGltdW0gc3VwcG9ydGVkIHByZWNpc2lvbiBpcyAxOS5cbiAqICAgICA8L3A+XG4gKiAgIDwvbGk+XG4gKiAgIDxsaT5cbiAqICAgICA8aDQ+VmFyQ2hhciwgTlZhckNoYXI8L2g0PlxuICogICAgIDxwPlxuICogICAgICAgPGNvZGU+dmFyY2hhcihtYXgpPC9jb2RlPiBhbmQgPGNvZGU+bnZhcmNoYXIobWF4KTwvY29kZT4gYXJlIGFsc28gc3VwcG9ydGVkLlxuICogICAgIDwvcD5cbiAqICAgPC9saT5cbiAqICAgPGxpPlxuICogICAgIDxoND5VbmlxdWVJZGVudGlmaWVyPC9oND5cbiAqICAgICA8cD5cbiAqICAgICAgIFZhbHVlcyBhcmUgcmV0dXJuZWQgYXMgYSAxNiBieXRlIGhleGFkZWNpbWFsIHN0cmluZy5cbiAqICAgICA8L3A+XG4gKiAgICAgPHA+XG4gKiAgICAgICBOb3RlIHRoYXQgdGhlIG9yZGVyIG9mIGJ5dGVzIGlzIG5vdCB0aGUgc2FtZSBhcyB0aGUgY2hhcmFjdGVyIHJlcHJlc2VudGF0aW9uLiBTZWVcbiAqICAgICAgIDxhIGhyZWY9XCJodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvbXMxOTAyMTUuYXNweFwiPlVzaW5nIHVuaXF1ZWlkZW50aWZpZXIgRGF0YTwvYT5cbiAqICAgICAgIGZvciBhbiBleGFtcGxlIG9mIHRoZSBkaWZmZXJlbnQgb3JkZXJpbmcgb2YgYnl0ZXMuXG4gKiAgICAgPC9wPlxuICogICA8L2xpPlxuICogPC9vbD5cbiAqL1xuZXhwb3J0IGNvbnN0IFRZUEVTID0ge1xuICBUaW55SW50LFxuICBCaXQsXG4gIFNtYWxsSW50LFxuICBJbnQsXG4gIFNtYWxsRGF0ZVRpbWUsXG4gIFJlYWwsXG4gIE1vbmV5LFxuICBEYXRlVGltZSxcbiAgRmxvYXQsXG4gIERlY2ltYWwsXG4gIE51bWVyaWMsXG4gIFNtYWxsTW9uZXksXG4gIEJpZ0ludCxcbiAgSW1hZ2UsXG4gIFRleHQsXG4gIFVuaXF1ZUlkZW50aWZpZXIsXG4gIE5UZXh0LFxuICBWYXJCaW5hcnksXG4gIFZhckNoYXIsXG4gIEJpbmFyeSxcbiAgQ2hhcixcbiAgTlZhckNoYXIsXG4gIE5DaGFyLFxuICBYbWwsXG4gIFRpbWUsXG4gIERhdGUsXG4gIERhdGVUaW1lMixcbiAgRGF0ZVRpbWVPZmZzZXQsXG4gIFVEVCxcbiAgVFZQLFxuICBWYXJpYW50XG59O1xuXG5leHBvcnQgY29uc3QgdHlwZUJ5TmFtZSA9IFRZUEVTO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxRQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxJQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRyxTQUFBLEdBQUFKLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBSSxJQUFBLEdBQUFMLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBSyxjQUFBLEdBQUFOLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTSxLQUFBLEdBQUFQLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBTyxNQUFBLEdBQUFSLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBUSxTQUFBLEdBQUFULHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBUyxNQUFBLEdBQUFWLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBVSxRQUFBLEdBQUFYLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBVyxRQUFBLEdBQUFaLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBWSxXQUFBLEdBQUFiLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBYSxPQUFBLEdBQUFkLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBYyxNQUFBLEdBQUFmLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBZSxLQUFBLEdBQUFoQixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQWdCLGlCQUFBLEdBQUFqQixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQWlCLEtBQUEsR0FBQWxCLHNCQUFBLENBQUFDLE9BQUE7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLE1BQU1DLEtBQUssR0FBQXpDLE9BQUEsQ0FBQXlDLEtBQUEsR0FBRztFQUNuQnRDLE9BQU8sRUFBUEEsZ0JBQU87RUFDUEMsR0FBRyxFQUFIQSxZQUFHO0VBQ0hDLFFBQVEsRUFBUkEsaUJBQVE7RUFDUkMsR0FBRyxFQUFIQSxZQUFHO0VBQ0hDLGFBQWEsRUFBYkEsc0JBQWE7RUFDYkMsSUFBSSxFQUFKQSxhQUFJO0VBQ0pDLEtBQUssRUFBTEEsY0FBSztFQUNMQyxRQUFRLEVBQVJBLGlCQUFRO0VBQ1JDLEtBQUssRUFBTEEsY0FBSztFQUNMQyxPQUFPLEVBQVBBLGdCQUFPO0VBQ1BDLE9BQU8sRUFBUEEsZ0JBQU87RUFDUEMsVUFBVSxFQUFWQSxtQkFBVTtFQUNWQyxNQUFNLEVBQU5BLGVBQU07RUFDTkMsS0FBSyxFQUFMQSxjQUFLO0VBQ0xDLElBQUksRUFBSkEsYUFBSTtFQUNKQyxnQkFBZ0IsRUFBaEJBLHlCQUFnQjtFQUNoQkUsS0FBSyxFQUFMQSxjQUFLO0VBQ0xPLFNBQVMsRUFBVEEsa0JBQVM7RUFDVEMsT0FBTyxFQUFQQSxnQkFBTztFQUNQQyxNQUFNLEVBQU5BLGVBQU07RUFDTkMsSUFBSSxFQUFKQSxhQUFJO0VBQ0pDLFFBQVEsRUFBUkEsaUJBQVE7RUFDUkMsS0FBSyxFQUFMQSxjQUFLO0VBQ0xDLEdBQUcsRUFBSEEsWUFBRztFQUNIQyxJQUFJLEVBQUpBLGFBQUk7RUFDSkMsSUFBSSxFQUFKQSxhQUFJO0VBQ0pDLFNBQVMsRUFBVEEsa0JBQVM7RUFDVEMsY0FBYyxFQUFkQSx1QkFBYztFQUNkQyxHQUFHLEVBQUhBLFlBQUc7RUFDSEMsR0FBRyxFQUFIQSxZQUFHO0VBQ0hDLE9BQU8sRUFBUEE7QUFDRixDQUFDO0FBRU0sTUFBTUUsVUFBVSxHQUFBMUMsT0FBQSxDQUFBMEMsVUFBQSxHQUFHRCxLQUFLIiwiaWdub3JlTGlzdCI6W119
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/metadata-parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
exports.readCollation = readCollation;
exports.readMetadata = readMetadata;
var _collation = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/collation.js [app-route] (ecmascript)");
var _dataType = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-type.js [app-route] (ecmascript)");
var _sprintfJs = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/sprintf-js@1.1.3/node_modules/sprintf-js/src/sprintf.js [app-route] (ecmascript)");
var _helpers = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/token/helpers.js [app-route] (ecmascript)");
function readCollation(buf, offset) {
    offset = +offset;
    if (buf.length < offset + 5) {
        throw new _helpers.NotEnoughDataError(offset + 5);
    }
    const collation = _collation.Collation.fromBuffer(buf.slice(offset, offset + 5));
    return new _helpers.Result(collation, offset + 5);
}
function readSchema(buf, offset) {
    offset = +offset;
    let schemaPresent;
    ({ offset, value: schemaPresent } = (0, _helpers.readUInt8)(buf, offset));
    if (schemaPresent !== 0x01) {
        return new _helpers.Result(undefined, offset);
    }
    let dbname;
    ({ offset, value: dbname } = (0, _helpers.readBVarChar)(buf, offset));
    let owningSchema;
    ({ offset, value: owningSchema } = (0, _helpers.readBVarChar)(buf, offset));
    let xmlSchemaCollection;
    ({ offset, value: xmlSchemaCollection } = (0, _helpers.readUsVarChar)(buf, offset));
    return new _helpers.Result({
        dbname,
        owningSchema,
        xmlSchemaCollection
    }, offset);
}
function readUDTInfo(buf, offset) {
    let maxByteSize;
    ({ offset, value: maxByteSize } = (0, _helpers.readUInt16LE)(buf, offset));
    let dbname;
    ({ offset, value: dbname } = (0, _helpers.readBVarChar)(buf, offset));
    let owningSchema;
    ({ offset, value: owningSchema } = (0, _helpers.readBVarChar)(buf, offset));
    let typeName;
    ({ offset, value: typeName } = (0, _helpers.readBVarChar)(buf, offset));
    let assemblyName;
    ({ offset, value: assemblyName } = (0, _helpers.readUsVarChar)(buf, offset));
    return new _helpers.Result({
        maxByteSize: maxByteSize,
        dbname: dbname,
        owningSchema: owningSchema,
        typeName: typeName,
        assemblyName: assemblyName
    }, offset);
}
function readMetadata(buf, offset, options) {
    let userType;
    ({ offset, value: userType } = (options.tdsVersion < '7_2' ? _helpers.readUInt16LE : _helpers.readUInt32LE)(buf, offset));
    let flags;
    ({ offset, value: flags } = (0, _helpers.readUInt16LE)(buf, offset));
    let typeNumber;
    ({ offset, value: typeNumber } = (0, _helpers.readUInt8)(buf, offset));
    const type = _dataType.TYPE[typeNumber];
    if (!type) {
        throw new Error((0, _sprintfJs.sprintf)('Unrecognised data type 0x%02X', typeNumber));
    }
    switch(type.name){
        case 'Null':
        case 'TinyInt':
        case 'SmallInt':
        case 'Int':
        case 'BigInt':
        case 'Real':
        case 'Float':
        case 'SmallMoney':
        case 'Money':
        case 'Bit':
        case 'SmallDateTime':
        case 'DateTime':
        case 'Date':
            return new _helpers.Result({
                userType: userType,
                flags: flags,
                type: type,
                collation: undefined,
                precision: undefined,
                scale: undefined,
                dataLength: undefined,
                schema: undefined,
                udtInfo: undefined
            }, offset);
        case 'IntN':
        case 'FloatN':
        case 'MoneyN':
        case 'BitN':
        case 'UniqueIdentifier':
        case 'DateTimeN':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: undefined,
                    precision: undefined,
                    scale: undefined,
                    dataLength: dataLength,
                    schema: undefined,
                    udtInfo: undefined
                }, offset);
            }
        case 'Variant':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt32LE)(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: undefined,
                    precision: undefined,
                    scale: undefined,
                    dataLength: dataLength,
                    schema: undefined,
                    udtInfo: undefined
                }, offset);
            }
        case 'VarChar':
        case 'Char':
        case 'NVarChar':
        case 'NChar':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt16LE)(buf, offset));
                let collation;
                ({ offset, value: collation } = readCollation(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: collation,
                    precision: undefined,
                    scale: undefined,
                    dataLength: dataLength,
                    schema: undefined,
                    udtInfo: undefined
                }, offset);
            }
        case 'Text':
        case 'NText':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt32LE)(buf, offset));
                let collation;
                ({ offset, value: collation } = readCollation(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: collation,
                    precision: undefined,
                    scale: undefined,
                    dataLength: dataLength,
                    schema: undefined,
                    udtInfo: undefined
                }, offset);
            }
        case 'VarBinary':
        case 'Binary':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt16LE)(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: undefined,
                    precision: undefined,
                    scale: undefined,
                    dataLength: dataLength,
                    schema: undefined,
                    udtInfo: undefined
                }, offset);
            }
        case 'Image':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt32LE)(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: undefined,
                    precision: undefined,
                    scale: undefined,
                    dataLength: dataLength,
                    schema: undefined,
                    udtInfo: undefined
                }, offset);
            }
        case 'Xml':
            {
                let schema;
                ({ offset, value: schema } = readSchema(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: undefined,
                    precision: undefined,
                    scale: undefined,
                    dataLength: undefined,
                    schema: schema,
                    udtInfo: undefined
                }, offset);
            }
        case 'Time':
        case 'DateTime2':
        case 'DateTimeOffset':
            {
                let scale;
                ({ offset, value: scale } = (0, _helpers.readUInt8)(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: undefined,
                    precision: undefined,
                    scale: scale,
                    dataLength: undefined,
                    schema: undefined,
                    udtInfo: undefined
                }, offset);
            }
        case 'NumericN':
        case 'DecimalN':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                let precision;
                ({ offset, value: precision } = (0, _helpers.readUInt8)(buf, offset));
                let scale;
                ({ offset, value: scale } = (0, _helpers.readUInt8)(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: undefined,
                    precision: precision,
                    scale: scale,
                    dataLength: dataLength,
                    schema: undefined,
                    udtInfo: undefined
                }, offset);
            }
        case 'UDT':
            {
                let udtInfo;
                ({ offset, value: udtInfo } = readUDTInfo(buf, offset));
                return new _helpers.Result({
                    userType: userType,
                    flags: flags,
                    type: type,
                    collation: undefined,
                    precision: undefined,
                    scale: undefined,
                    dataLength: undefined,
                    schema: undefined,
                    udtInfo: udtInfo
                }, offset);
            }
        default:
            throw new Error((0, _sprintfJs.sprintf)('Unrecognised type %s', type.name));
    }
}
function metadataParse(parser, options, callback) {
    (async ()=>{
        while(true){
            let result;
            try {
                result = readMetadata(parser.buffer, parser.position, options);
            } catch (err) {
                if (err instanceof _helpers.NotEnoughDataError) {
                    await parser.waitForChunk();
                    continue;
                }
                throw err;
            }
            parser.position = result.offset;
            return callback(result.value);
        }
    })();
}
var _default = exports.default = metadataParse;
module.exports = metadataParse;
module.exports.readCollation = readCollation;
module.exports.readMetadata = readMetadata; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfY29sbGF0aW9uIiwicmVxdWlyZSIsIl9kYXRhVHlwZSIsIl9zcHJpbnRmSnMiLCJfaGVscGVycyIsInJlYWRDb2xsYXRpb24iLCJidWYiLCJvZmZzZXQiLCJsZW5ndGgiLCJOb3RFbm91Z2hEYXRhRXJyb3IiLCJjb2xsYXRpb24iLCJDb2xsYXRpb24iLCJmcm9tQnVmZmVyIiwic2xpY2UiLCJSZXN1bHQiLCJyZWFkU2NoZW1hIiwic2NoZW1hUHJlc2VudCIsInZhbHVlIiwicmVhZFVJbnQ4IiwidW5kZWZpbmVkIiwiZGJuYW1lIiwicmVhZEJWYXJDaGFyIiwib3duaW5nU2NoZW1hIiwieG1sU2NoZW1hQ29sbGVjdGlvbiIsInJlYWRVc1ZhckNoYXIiLCJyZWFkVURUSW5mbyIsIm1heEJ5dGVTaXplIiwicmVhZFVJbnQxNkxFIiwidHlwZU5hbWUiLCJhc3NlbWJseU5hbWUiLCJyZWFkTWV0YWRhdGEiLCJvcHRpb25zIiwidXNlclR5cGUiLCJ0ZHNWZXJzaW9uIiwicmVhZFVJbnQzMkxFIiwiZmxhZ3MiLCJ0eXBlTnVtYmVyIiwidHlwZSIsIlRZUEUiLCJFcnJvciIsInNwcmludGYiLCJuYW1lIiwicHJlY2lzaW9uIiwic2NhbGUiLCJkYXRhTGVuZ3RoIiwic2NoZW1hIiwidWR0SW5mbyIsIm1ldGFkYXRhUGFyc2UiLCJwYXJzZXIiLCJjYWxsYmFjayIsInJlc3VsdCIsImJ1ZmZlciIsInBvc2l0aW9uIiwiZXJyIiwid2FpdEZvckNodW5rIiwiX2RlZmF1bHQiLCJleHBvcnRzIiwiZGVmYXVsdCIsIm1vZHVsZSJdLCJzb3VyY2VzIjpbIi4uL3NyYy9tZXRhZGF0YS1wYXJzZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29sbGF0aW9uIH0gZnJvbSAnLi9jb2xsYXRpb24nO1xuaW1wb3J0IFBhcnNlciwgeyB0eXBlIFBhcnNlck9wdGlvbnMgfSBmcm9tICcuL3Rva2VuL3N0cmVhbS1wYXJzZXInO1xuaW1wb3J0IHsgVFlQRSwgdHlwZSBEYXRhVHlwZSB9IGZyb20gJy4vZGF0YS10eXBlJztcbmltcG9ydCB7IHR5cGUgQ3J5cHRvTWV0YWRhdGEgfSBmcm9tICcuL2Fsd2F5cy1lbmNyeXB0ZWQvdHlwZXMnO1xuXG5pbXBvcnQgeyBzcHJpbnRmIH0gZnJvbSAnc3ByaW50Zi1qcyc7XG5cbmltcG9ydCB7IFJlc3VsdCwgTm90RW5vdWdoRGF0YUVycm9yLCByZWFkVUludDgsIHJlYWRCVmFyQ2hhciwgcmVhZFVzVmFyQ2hhciwgcmVhZFVJbnQxNkxFLCByZWFkVUludDMyTEUgfSBmcm9tICcuL3Rva2VuL2hlbHBlcnMnO1xuXG5pbnRlcmZhY2UgWG1sU2NoZW1hIHtcbiAgZGJuYW1lOiBzdHJpbmc7XG4gIG93bmluZ1NjaGVtYTogc3RyaW5nO1xuICB4bWxTY2hlbWFDb2xsZWN0aW9uOiBzdHJpbmc7XG59XG5cbmludGVyZmFjZSBVZHRJbmZvIHtcbiAgbWF4Qnl0ZVNpemU6IG51bWJlcjtcbiAgZGJuYW1lOiBzdHJpbmc7XG4gIG93bmluZ1NjaGVtYTogc3RyaW5nO1xuICB0eXBlTmFtZTogc3RyaW5nO1xuICBhc3NlbWJseU5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgQmFzZU1ldGFkYXRhID0ge1xuICB1c2VyVHlwZTogbnVtYmVyO1xuXG4gIGZsYWdzOiBudW1iZXI7XG4gIC8qKlxuICAgKiBUaGUgY29sdW1uJ3MgdHlwZSwgc3VjaCBhcyBWYXJDaGFyLCBJbnQgb3IgQmluYXJ5LlxuICAgKi9cbiAgdHlwZTogRGF0YVR5cGU7XG5cbiAgY29sbGF0aW9uOiBDb2xsYXRpb24gfCB1bmRlZmluZWQ7XG4gIC8qKlxuICAgKiBUaGUgcHJlY2lzaW9uLiBPbmx5IGFwcGxpY2FibGUgdG8gbnVtZXJpYyBhbmQgZGVjaW1hbC5cbiAgICovXG4gIHByZWNpc2lvbjogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gIC8qKlxuICAgKiBUaGUgc2NhbGUuIE9ubHkgYXBwbGljYWJsZSB0byBudW1lcmljLCBkZWNpbWFsLCB0aW1lLCBkYXRldGltZTIgYW5kIGRhdGV0aW1lb2Zmc2V0LlxuICAgKi9cbiAgc2NhbGU6IG51bWJlciB8IHVuZGVmaW5lZDtcblxuICAvKipcbiAgICogVGhlIGxlbmd0aCwgZm9yIGNoYXIsIHZhcmNoYXIsIG52YXJjaGFyIGFuZCB2YXJiaW5hcnkuXG4gICAqL1xuICBkYXRhTGVuZ3RoOiBudW1iZXIgfCB1bmRlZmluZWQ7XG5cbiAgc2NoZW1hOiBYbWxTY2hlbWEgfCB1bmRlZmluZWQ7XG5cbiAgdWR0SW5mbzogVWR0SW5mbyB8IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IHR5cGUgTWV0YWRhdGEgPSB7XG4gIGNyeXB0b01ldGFkYXRhPzogQ3J5cHRvTWV0YWRhdGE7XG59ICYgQmFzZU1ldGFkYXRhO1xuXG5mdW5jdGlvbiByZWFkQ29sbGF0aW9uKGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlcik6IFJlc3VsdDxDb2xsYXRpb24+IHtcbiAgb2Zmc2V0ID0gK29mZnNldDtcblxuICBpZiAoYnVmLmxlbmd0aCA8IG9mZnNldCArIDUpIHtcbiAgICB0aHJvdyBuZXcgTm90RW5vdWdoRGF0YUVycm9yKG9mZnNldCArIDUpO1xuICB9XG5cbiAgY29uc3QgY29sbGF0aW9uID0gQ29sbGF0aW9uLmZyb21CdWZmZXIoYnVmLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgNSkpO1xuICByZXR1cm4gbmV3IFJlc3VsdChjb2xsYXRpb24sIG9mZnNldCArIDUpO1xufVxuXG5mdW5jdGlvbiByZWFkU2NoZW1hKGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlcik6IFJlc3VsdDxYbWxTY2hlbWEgfCB1bmRlZmluZWQ+IHtcbiAgb2Zmc2V0ID0gK29mZnNldDtcblxuICBsZXQgc2NoZW1hUHJlc2VudDtcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogc2NoZW1hUHJlc2VudCB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgaWYgKHNjaGVtYVByZXNlbnQgIT09IDB4MDEpIHtcbiAgICByZXR1cm4gbmV3IFJlc3VsdCh1bmRlZmluZWQsIG9mZnNldCk7XG4gIH1cblxuICBsZXQgZGJuYW1lO1xuICAoeyBvZmZzZXQsIHZhbHVlOiBkYm5hbWUgfSA9IHJlYWRCVmFyQ2hhcihidWYsIG9mZnNldCkpO1xuXG4gIGxldCBvd25pbmdTY2hlbWE7XG4gICh7IG9mZnNldCwgdmFsdWU6IG93bmluZ1NjaGVtYSB9ID0gcmVhZEJWYXJDaGFyKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgbGV0IHhtbFNjaGVtYUNvbGxlY3Rpb247XG4gICh7IG9mZnNldCwgdmFsdWU6IHhtbFNjaGVtYUNvbGxlY3Rpb24gfSA9IHJlYWRVc1ZhckNoYXIoYnVmLCBvZmZzZXQpKTtcblxuICByZXR1cm4gbmV3IFJlc3VsdCh7IGRibmFtZSwgb3duaW5nU2NoZW1hLCB4bWxTY2hlbWFDb2xsZWN0aW9uIH0sIG9mZnNldCk7XG59XG5cbmZ1bmN0aW9uIHJlYWRVRFRJbmZvKGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlcik6IFJlc3VsdDxVZHRJbmZvPiB7XG4gIGxldCBtYXhCeXRlU2l6ZTtcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogbWF4Qnl0ZVNpemUgfSA9IHJlYWRVSW50MTZMRShidWYsIG9mZnNldCkpO1xuXG4gIGxldCBkYm5hbWU7XG4gICh7IG9mZnNldCwgdmFsdWU6IGRibmFtZSB9ID0gcmVhZEJWYXJDaGFyKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgbGV0IG93bmluZ1NjaGVtYTtcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogb3duaW5nU2NoZW1hIH0gPSByZWFkQlZhckNoYXIoYnVmLCBvZmZzZXQpKTtcblxuICBsZXQgdHlwZU5hbWU7XG4gICh7IG9mZnNldCwgdmFsdWU6IHR5cGVOYW1lIH0gPSByZWFkQlZhckNoYXIoYnVmLCBvZmZzZXQpKTtcblxuICBsZXQgYXNzZW1ibHlOYW1lO1xuICAoeyBvZmZzZXQsIHZhbHVlOiBhc3NlbWJseU5hbWUgfSA9IHJlYWRVc1ZhckNoYXIoYnVmLCBvZmZzZXQpKTtcblxuICByZXR1cm4gbmV3IFJlc3VsdCh7XG4gICAgbWF4Qnl0ZVNpemU6IG1heEJ5dGVTaXplLFxuICAgIGRibmFtZTogZGJuYW1lLFxuICAgIG93bmluZ1NjaGVtYTogb3duaW5nU2NoZW1hLFxuICAgIHR5cGVOYW1lOiB0eXBlTmFtZSxcbiAgICBhc3NlbWJseU5hbWU6IGFzc2VtYmx5TmFtZVxuICB9LCBvZmZzZXQpO1xufVxuXG5mdW5jdGlvbiByZWFkTWV0YWRhdGEoYnVmOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCBvcHRpb25zOiBQYXJzZXJPcHRpb25zKTogUmVzdWx0PE1ldGFkYXRhPiB7XG4gIGxldCB1c2VyVHlwZTtcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogdXNlclR5cGUgfSA9IChvcHRpb25zLnRkc1ZlcnNpb24gPCAnN18yJyA/IHJlYWRVSW50MTZMRSA6IHJlYWRVSW50MzJMRSkoYnVmLCBvZmZzZXQpKTtcblxuICBsZXQgZmxhZ3M7XG4gICh7IG9mZnNldCwgdmFsdWU6IGZsYWdzIH0gPSByZWFkVUludDE2TEUoYnVmLCBvZmZzZXQpKTtcblxuICBsZXQgdHlwZU51bWJlcjtcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogdHlwZU51bWJlciB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgY29uc3QgdHlwZTogRGF0YVR5cGUgPSBUWVBFW3R5cGVOdW1iZXJdO1xuICBpZiAoIXR5cGUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByaW50ZignVW5yZWNvZ25pc2VkIGRhdGEgdHlwZSAweCUwMlgnLCB0eXBlTnVtYmVyKSk7XG4gIH1cblxuICBzd2l0Y2ggKHR5cGUubmFtZSkge1xuICAgIGNhc2UgJ051bGwnOlxuICAgIGNhc2UgJ1RpbnlJbnQnOlxuICAgIGNhc2UgJ1NtYWxsSW50JzpcbiAgICBjYXNlICdJbnQnOlxuICAgIGNhc2UgJ0JpZ0ludCc6XG4gICAgY2FzZSAnUmVhbCc6XG4gICAgY2FzZSAnRmxvYXQnOlxuICAgIGNhc2UgJ1NtYWxsTW9uZXknOlxuICAgIGNhc2UgJ01vbmV5JzpcbiAgICBjYXNlICdCaXQnOlxuICAgIGNhc2UgJ1NtYWxsRGF0ZVRpbWUnOlxuICAgIGNhc2UgJ0RhdGVUaW1lJzpcbiAgICBjYXNlICdEYXRlJzpcbiAgICAgIHJldHVybiBuZXcgUmVzdWx0KHtcbiAgICAgICAgdXNlclR5cGU6IHVzZXJUeXBlLFxuICAgICAgICBmbGFnczogZmxhZ3MsXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGNvbGxhdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICBwcmVjaXNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgc2NhbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgZGF0YUxlbmd0aDogdW5kZWZpbmVkLFxuICAgICAgICBzY2hlbWE6IHVuZGVmaW5lZCxcbiAgICAgICAgdWR0SW5mbzogdW5kZWZpbmVkXG4gICAgICB9LCBvZmZzZXQpO1xuXG4gICAgY2FzZSAnSW50Tic6XG4gICAgY2FzZSAnRmxvYXROJzpcbiAgICBjYXNlICdNb25leU4nOlxuICAgIGNhc2UgJ0JpdE4nOlxuICAgIGNhc2UgJ1VuaXF1ZUlkZW50aWZpZXInOlxuICAgIGNhc2UgJ0RhdGVUaW1lTic6IHtcbiAgICAgIGxldCBkYXRhTGVuZ3RoO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF0YUxlbmd0aCB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIHJldHVybiBuZXcgUmVzdWx0KHtcbiAgICAgICAgdXNlclR5cGU6IHVzZXJUeXBlLFxuICAgICAgICBmbGFnczogZmxhZ3MsXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGNvbGxhdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICBwcmVjaXNpb246IHVuZGVmaW5lZCxcbiAgICAgICAgc2NhbGU6IHVuZGVmaW5lZCxcbiAgICAgICAgZGF0YUxlbmd0aDogZGF0YUxlbmd0aCxcbiAgICAgICAgc2NoZW1hOiB1bmRlZmluZWQsXG4gICAgICAgIHVkdEluZm86IHVuZGVmaW5lZFxuICAgICAgfSwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICBjYXNlICdWYXJpYW50Jzoge1xuICAgICAgbGV0IGRhdGFMZW5ndGg7XG4gICAgICAoeyBvZmZzZXQsIHZhbHVlOiBkYXRhTGVuZ3RoIH0gPSByZWFkVUludDMyTEUoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgcmV0dXJuIG5ldyBSZXN1bHQoe1xuICAgICAgICB1c2VyVHlwZTogdXNlclR5cGUsXG4gICAgICAgIGZsYWdzOiBmbGFncyxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgY29sbGF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgIHByZWNpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICBzY2FsZTogdW5kZWZpbmVkLFxuICAgICAgICBkYXRhTGVuZ3RoOiBkYXRhTGVuZ3RoLFxuICAgICAgICBzY2hlbWE6IHVuZGVmaW5lZCxcbiAgICAgICAgdWR0SW5mbzogdW5kZWZpbmVkXG4gICAgICB9LCBvZmZzZXQpO1xuICAgIH1cblxuICAgIGNhc2UgJ1ZhckNoYXInOlxuICAgIGNhc2UgJ0NoYXInOlxuICAgIGNhc2UgJ05WYXJDaGFyJzpcbiAgICBjYXNlICdOQ2hhcic6IHtcbiAgICAgIGxldCBkYXRhTGVuZ3RoO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF0YUxlbmd0aCB9ID0gcmVhZFVJbnQxNkxFKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIGxldCBjb2xsYXRpb247XG4gICAgICAoeyBvZmZzZXQsIHZhbHVlOiBjb2xsYXRpb24gfSA9IHJlYWRDb2xsYXRpb24oYnVmLCBvZmZzZXQpKTtcblxuICAgICAgcmV0dXJuIG5ldyBSZXN1bHQoe1xuICAgICAgICB1c2VyVHlwZTogdXNlclR5cGUsXG4gICAgICAgIGZsYWdzOiBmbGFncyxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgY29sbGF0aW9uOiBjb2xsYXRpb24sXG4gICAgICAgIHByZWNpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICBzY2FsZTogdW5kZWZpbmVkLFxuICAgICAgICBkYXRhTGVuZ3RoOiBkYXRhTGVuZ3RoLFxuICAgICAgICBzY2hlbWE6IHVuZGVmaW5lZCxcbiAgICAgICAgdWR0SW5mbzogdW5kZWZpbmVkXG4gICAgICB9LCBvZmZzZXQpO1xuICAgIH1cblxuICAgIGNhc2UgJ1RleHQnOlxuICAgIGNhc2UgJ05UZXh0Jzoge1xuICAgICAgbGV0IGRhdGFMZW5ndGg7XG4gICAgICAoeyBvZmZzZXQsIHZhbHVlOiBkYXRhTGVuZ3RoIH0gPSByZWFkVUludDMyTEUoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgbGV0IGNvbGxhdGlvbjtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGNvbGxhdGlvbiB9ID0gcmVhZENvbGxhdGlvbihidWYsIG9mZnNldCkpO1xuXG4gICAgICByZXR1cm4gbmV3IFJlc3VsdCh7XG4gICAgICAgIHVzZXJUeXBlOiB1c2VyVHlwZSxcbiAgICAgICAgZmxhZ3M6IGZsYWdzLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBjb2xsYXRpb246IGNvbGxhdGlvbixcbiAgICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgIHNjYWxlOiB1bmRlZmluZWQsXG4gICAgICAgIGRhdGFMZW5ndGg6IGRhdGFMZW5ndGgsXG4gICAgICAgIHNjaGVtYTogdW5kZWZpbmVkLFxuICAgICAgICB1ZHRJbmZvOiB1bmRlZmluZWRcbiAgICAgIH0sIG9mZnNldCk7XG4gICAgfVxuXG4gICAgY2FzZSAnVmFyQmluYXJ5JzpcbiAgICBjYXNlICdCaW5hcnknOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50MTZMRShidWYsIG9mZnNldCkpO1xuXG4gICAgICByZXR1cm4gbmV3IFJlc3VsdCh7XG4gICAgICAgIHVzZXJUeXBlOiB1c2VyVHlwZSxcbiAgICAgICAgZmxhZ3M6IGZsYWdzLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBjb2xsYXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgIHNjYWxlOiB1bmRlZmluZWQsXG4gICAgICAgIGRhdGFMZW5ndGg6IGRhdGFMZW5ndGgsXG4gICAgICAgIHNjaGVtYTogdW5kZWZpbmVkLFxuICAgICAgICB1ZHRJbmZvOiB1bmRlZmluZWRcbiAgICAgIH0sIG9mZnNldCk7XG4gICAgfVxuXG4gICAgY2FzZSAnSW1hZ2UnOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50MzJMRShidWYsIG9mZnNldCkpO1xuXG4gICAgICByZXR1cm4gbmV3IFJlc3VsdCh7XG4gICAgICAgIHVzZXJUeXBlOiB1c2VyVHlwZSxcbiAgICAgICAgZmxhZ3M6IGZsYWdzLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBjb2xsYXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgIHNjYWxlOiB1bmRlZmluZWQsXG4gICAgICAgIGRhdGFMZW5ndGg6IGRhdGFMZW5ndGgsXG4gICAgICAgIHNjaGVtYTogdW5kZWZpbmVkLFxuICAgICAgICB1ZHRJbmZvOiB1bmRlZmluZWRcbiAgICAgIH0sIG9mZnNldCk7XG4gICAgfVxuXG4gICAgY2FzZSAnWG1sJzoge1xuICAgICAgbGV0IHNjaGVtYTtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IHNjaGVtYSB9ID0gcmVhZFNjaGVtYShidWYsIG9mZnNldCkpO1xuXG4gICAgICByZXR1cm4gbmV3IFJlc3VsdCh7XG4gICAgICAgIHVzZXJUeXBlOiB1c2VyVHlwZSxcbiAgICAgICAgZmxhZ3M6IGZsYWdzLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBjb2xsYXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgIHNjYWxlOiB1bmRlZmluZWQsXG4gICAgICAgIGRhdGFMZW5ndGg6IHVuZGVmaW5lZCxcbiAgICAgICAgc2NoZW1hOiBzY2hlbWEsXG4gICAgICAgIHVkdEluZm86IHVuZGVmaW5lZFxuICAgICAgfSwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICBjYXNlICdUaW1lJzpcbiAgICBjYXNlICdEYXRlVGltZTInOlxuICAgIGNhc2UgJ0RhdGVUaW1lT2Zmc2V0Jzoge1xuICAgICAgbGV0IHNjYWxlO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogc2NhbGUgfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gICAgICByZXR1cm4gbmV3IFJlc3VsdCh7XG4gICAgICAgIHVzZXJUeXBlOiB1c2VyVHlwZSxcbiAgICAgICAgZmxhZ3M6IGZsYWdzLFxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBjb2xsYXRpb246IHVuZGVmaW5lZCxcbiAgICAgICAgcHJlY2lzaW9uOiB1bmRlZmluZWQsXG4gICAgICAgIHNjYWxlOiBzY2FsZSxcbiAgICAgICAgZGF0YUxlbmd0aDogdW5kZWZpbmVkLFxuICAgICAgICBzY2hlbWE6IHVuZGVmaW5lZCxcbiAgICAgICAgdWR0SW5mbzogdW5kZWZpbmVkXG4gICAgICB9LCBvZmZzZXQpO1xuICAgIH1cblxuICAgIGNhc2UgJ051bWVyaWNOJzpcbiAgICBjYXNlICdEZWNpbWFsTic6IHtcbiAgICAgIGxldCBkYXRhTGVuZ3RoO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF0YUxlbmd0aCB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIGxldCBwcmVjaXNpb247XG4gICAgICAoeyBvZmZzZXQsIHZhbHVlOiBwcmVjaXNpb24gfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gICAgICBsZXQgc2NhbGU7XG4gICAgICAoeyBvZmZzZXQsIHZhbHVlOiBzY2FsZSB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIHJldHVybiBuZXcgUmVzdWx0KHtcbiAgICAgICAgdXNlclR5cGU6IHVzZXJUeXBlLFxuICAgICAgICBmbGFnczogZmxhZ3MsXG4gICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgIGNvbGxhdGlvbjogdW5kZWZpbmVkLFxuICAgICAgICBwcmVjaXNpb246IHByZWNpc2lvbixcbiAgICAgICAgc2NhbGU6IHNjYWxlLFxuICAgICAgICBkYXRhTGVuZ3RoOiBkYXRhTGVuZ3RoLFxuICAgICAgICBzY2hlbWE6IHVuZGVmaW5lZCxcbiAgICAgICAgdWR0SW5mbzogdW5kZWZpbmVkXG4gICAgICB9LCBvZmZzZXQpO1xuICAgIH1cblxuICAgIGNhc2UgJ1VEVCc6IHtcbiAgICAgIGxldCB1ZHRJbmZvO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogdWR0SW5mbyB9ID0gcmVhZFVEVEluZm8oYnVmLCBvZmZzZXQpKTtcblxuICAgICAgcmV0dXJuIG5ldyBSZXN1bHQoe1xuICAgICAgICB1c2VyVHlwZTogdXNlclR5cGUsXG4gICAgICAgIGZsYWdzOiBmbGFncyxcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgY29sbGF0aW9uOiB1bmRlZmluZWQsXG4gICAgICAgIHByZWNpc2lvbjogdW5kZWZpbmVkLFxuICAgICAgICBzY2FsZTogdW5kZWZpbmVkLFxuICAgICAgICBkYXRhTGVuZ3RoOiB1bmRlZmluZWQsXG4gICAgICAgIHNjaGVtYTogdW5kZWZpbmVkLFxuICAgICAgICB1ZHRJbmZvOiB1ZHRJbmZvXG4gICAgICB9LCBvZmZzZXQpO1xuICAgIH1cblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3Ioc3ByaW50ZignVW5yZWNvZ25pc2VkIHR5cGUgJXMnLCB0eXBlLm5hbWUpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtZXRhZGF0YVBhcnNlKHBhcnNlcjogUGFyc2VyLCBvcHRpb25zOiBQYXJzZXJPcHRpb25zLCBjYWxsYmFjazogKG1ldGFkYXRhOiBNZXRhZGF0YSkgPT4gdm9pZCkge1xuICAoYXN5bmMgKCkgPT4ge1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgcmVzdWx0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gcmVhZE1ldGFkYXRhKHBhcnNlci5idWZmZXIsIHBhcnNlci5wb3NpdGlvbiwgb3B0aW9ucyk7XG4gICAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICBpZiAoZXJyIGluc3RhbmNlb2YgTm90RW5vdWdoRGF0YUVycm9yKSB7XG4gICAgICAgICAgYXdhaXQgcGFyc2VyLndhaXRGb3JDaHVuaygpO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuXG4gICAgICBwYXJzZXIucG9zaXRpb24gPSByZXN1bHQub2Zmc2V0O1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHJlc3VsdC52YWx1ZSk7XG4gICAgfVxuICB9KSgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBtZXRhZGF0YVBhcnNlO1xuZXhwb3J0IHsgcmVhZENvbGxhdGlvbiwgcmVhZE1ldGFkYXRhIH07XG5cbm1vZHVsZS5leHBvcnRzID0gbWV0YWRhdGFQYXJzZTtcbm1vZHVsZS5leHBvcnRzLnJlYWRDb2xsYXRpb24gPSByZWFkQ29sbGF0aW9uO1xubW9kdWxlLmV4cG9ydHMucmVhZE1ldGFkYXRhID0gcmVhZE1ldGFkYXRhO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUFBLFVBQUEsR0FBQUMsT0FBQTtBQUVBLElBQUFDLFNBQUEsR0FBQUQsT0FBQTtBQUdBLElBQUFFLFVBQUEsR0FBQUYsT0FBQTtBQUVBLElBQUFHLFFBQUEsR0FBQUgsT0FBQTtBQWtEQSxTQUFTSSxhQUFhQSxDQUFDQyxHQUFXLEVBQUVDLE1BQWMsRUFBcUI7RUFDckVBLE1BQU0sR0FBRyxDQUFDQSxNQUFNO0VBRWhCLElBQUlELEdBQUcsQ0FBQ0UsTUFBTSxHQUFHRCxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQzNCLE1BQU0sSUFBSUUsMkJBQWtCLENBQUNGLE1BQU0sR0FBRyxDQUFDLENBQUM7RUFDMUM7RUFFQSxNQUFNRyxTQUFTLEdBQUdDLG9C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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/value-parser.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isPLPStream = isPLPStream;
exports.readPLPStream = readPLPStream;
exports.readValue = readValue;
var _metadataParser = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/metadata-parser.js [app-route] (ecmascript)");
var _dataType = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-type.js [app-route] (ecmascript)");
var _iconvLite = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/iconv-lite@0.7.2/node_modules/iconv-lite/lib/index.js [app-route] (ecmascript)"));
var _sprintfJs = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/sprintf-js@1.1.3/node_modules/sprintf-js/src/sprintf.js [app-route] (ecmascript)");
var _guidParser = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/guid-parser.js [app-route] (ecmascript)");
var _helpers = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/token/helpers.js [app-route] (ecmascript)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
const NULL = (1 << 16) - 1;
const MAX = (1 << 16) - 1;
const THREE_AND_A_THIRD = 3 + 1 / 3;
const MONEY_DIVISOR = 10000;
const PLP_NULL = 0xFFFFFFFFFFFFFFFFn;
const UNKNOWN_PLP_LEN = 0xFFFFFFFFFFFFFFFEn;
const DEFAULT_ENCODING = 'utf8';
function readTinyInt(buf, offset) {
    return (0, _helpers.readUInt8)(buf, offset);
}
function readSmallInt(buf, offset) {
    return (0, _helpers.readInt16LE)(buf, offset);
}
function readInt(buf, offset) {
    return (0, _helpers.readInt32LE)(buf, offset);
}
function readBigInt(buf, offset) {
    let value;
    ({ offset, value } = (0, _helpers.readBigInt64LE)(buf, offset));
    return new _helpers.Result(value.toString(), offset);
}
function readReal(buf, offset) {
    return (0, _helpers.readFloatLE)(buf, offset);
}
function readFloat(buf, offset) {
    return (0, _helpers.readDoubleLE)(buf, offset);
}
function readSmallMoney(buf, offset) {
    let value;
    ({ offset, value } = (0, _helpers.readInt32LE)(buf, offset));
    return new _helpers.Result(value / MONEY_DIVISOR, offset);
}
function readMoney(buf, offset) {
    let high;
    ({ offset, value: high } = (0, _helpers.readInt32LE)(buf, offset));
    let low;
    ({ offset, value: low } = (0, _helpers.readUInt32LE)(buf, offset));
    return new _helpers.Result((low + 0x100000000 * high) / MONEY_DIVISOR, offset);
}
function readBit(buf, offset) {
    let value;
    ({ offset, value } = (0, _helpers.readUInt8)(buf, offset));
    return new _helpers.Result(!!value, offset);
}
function readValue(buf, offset, metadata, options) {
    const type = metadata.type;
    switch(type.name){
        case 'Null':
            return new _helpers.Result(null, offset);
        case 'TinyInt':
            {
                return readTinyInt(buf, offset);
            }
        case 'SmallInt':
            {
                return readSmallInt(buf, offset);
            }
        case 'Int':
            {
                return readInt(buf, offset);
            }
        case 'BigInt':
            {
                return readBigInt(buf, offset);
            }
        case 'IntN':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                switch(dataLength){
                    case 0:
                        return new _helpers.Result(null, offset);
                    case 1:
                        return readTinyInt(buf, offset);
                    case 2:
                        return readSmallInt(buf, offset);
                    case 4:
                        return readInt(buf, offset);
                    case 8:
                        return readBigInt(buf, offset);
                    default:
                        throw new Error('Unsupported dataLength ' + dataLength + ' for IntN');
                }
            }
        case 'Real':
            {
                return readReal(buf, offset);
            }
        case 'Float':
            {
                return readFloat(buf, offset);
            }
        case 'FloatN':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                switch(dataLength){
                    case 0:
                        return new _helpers.Result(null, offset);
                    case 4:
                        return readReal(buf, offset);
                    case 8:
                        return readFloat(buf, offset);
                    default:
                        throw new Error('Unsupported dataLength ' + dataLength + ' for FloatN');
                }
            }
        case 'SmallMoney':
            {
                return readSmallMoney(buf, offset);
            }
        case 'Money':
            return readMoney(buf, offset);
        case 'MoneyN':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                switch(dataLength){
                    case 0:
                        return new _helpers.Result(null, offset);
                    case 4:
                        return readSmallMoney(buf, offset);
                    case 8:
                        return readMoney(buf, offset);
                    default:
                        throw new Error('Unsupported dataLength ' + dataLength + ' for MoneyN');
                }
            }
        case 'Bit':
            {
                return readBit(buf, offset);
            }
        case 'BitN':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                switch(dataLength){
                    case 0:
                        return new _helpers.Result(null, offset);
                    case 1:
                        return readBit(buf, offset);
                    default:
                        throw new Error('Unsupported dataLength ' + dataLength + ' for BitN');
                }
            }
        case 'VarChar':
        case 'Char':
            {
                const codepage = metadata.collation.codepage;
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt16LE)(buf, offset));
                if (dataLength === NULL) {
                    return new _helpers.Result(null, offset);
                }
                return readChars(buf, offset, dataLength, codepage);
            }
        case 'NVarChar':
        case 'NChar':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt16LE)(buf, offset));
                if (dataLength === NULL) {
                    return new _helpers.Result(null, offset);
                }
                return readNChars(buf, offset, dataLength);
            }
        case 'VarBinary':
        case 'Binary':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt16LE)(buf, offset));
                if (dataLength === NULL) {
                    return new _helpers.Result(null, offset);
                }
                return readBinary(buf, offset, dataLength);
            }
        case 'Text':
            {
                let textPointerLength;
                ({ offset, value: textPointerLength } = (0, _helpers.readUInt8)(buf, offset));
                if (textPointerLength === 0) {
                    return new _helpers.Result(null, offset);
                }
                // Textpointer
                ({ offset } = readBinary(buf, offset, textPointerLength));
                // Timestamp
                ({ offset } = readBinary(buf, offset, 8));
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt32LE)(buf, offset));
                return readChars(buf, offset, dataLength, metadata.collation.codepage);
            }
        case 'NText':
            {
                let textPointerLength;
                ({ offset, value: textPointerLength } = (0, _helpers.readUInt8)(buf, offset));
                if (textPointerLength === 0) {
                    return new _helpers.Result(null, offset);
                }
                // Textpointer
                ({ offset } = readBinary(buf, offset, textPointerLength));
                // Timestamp
                ({ offset } = readBinary(buf, offset, 8));
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt32LE)(buf, offset));
                return readNChars(buf, offset, dataLength);
            }
        case 'Image':
            {
                let textPointerLength;
                ({ offset, value: textPointerLength } = (0, _helpers.readUInt8)(buf, offset));
                if (textPointerLength === 0) {
                    return new _helpers.Result(null, offset);
                }
                // Textpointer
                ({ offset } = readBinary(buf, offset, textPointerLength));
                // Timestamp
                ({ offset } = readBinary(buf, offset, 8));
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt32LE)(buf, offset));
                return readBinary(buf, offset, dataLength);
            }
        case 'SmallDateTime':
            {
                return readSmallDateTime(buf, offset, options.useUTC);
            }
        case 'DateTime':
            {
                return readDateTime(buf, offset, options.useUTC);
            }
        case 'DateTimeN':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                switch(dataLength){
                    case 0:
                        return new _helpers.Result(null, offset);
                    case 4:
                        return readSmallDateTime(buf, offset, options.useUTC);
                    case 8:
                        return readDateTime(buf, offset, options.useUTC);
                    default:
                        throw new Error('Unsupported dataLength ' + dataLength + ' for DateTimeN');
                }
            }
        case 'Time':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                if (dataLength === 0) {
                    return new _helpers.Result(null, offset);
                }
                return readTime(buf, offset, dataLength, metadata.scale, options.useUTC);
            }
        case 'Date':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                if (dataLength === 0) {
                    return new _helpers.Result(null, offset);
                }
                return readDate(buf, offset, options.useUTC);
            }
        case 'DateTime2':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                if (dataLength === 0) {
                    return new _helpers.Result(null, offset);
                }
                return readDateTime2(buf, offset, dataLength, metadata.scale, options.useUTC);
            }
        case 'DateTimeOffset':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                if (dataLength === 0) {
                    return new _helpers.Result(null, offset);
                }
                return readDateTimeOffset(buf, offset, dataLength, metadata.scale);
            }
        case 'NumericN':
        case 'DecimalN':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                if (dataLength === 0) {
                    return new _helpers.Result(null, offset);
                }
                return readNumeric(buf, offset, dataLength, metadata.precision, metadata.scale);
            }
        case 'UniqueIdentifier':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt8)(buf, offset));
                switch(dataLength){
                    case 0:
                        return new _helpers.Result(null, offset);
                    case 0x10:
                        return readUniqueIdentifier(buf, offset, options);
                    default:
                        throw new Error((0, _sprintfJs.sprintf)('Unsupported guid size %d', dataLength - 1));
                }
            }
        case 'Variant':
            {
                let dataLength;
                ({ offset, value: dataLength } = (0, _helpers.readUInt32LE)(buf, offset));
                if (dataLength === 0) {
                    return new _helpers.Result(null, offset);
                }
                return readVariant(buf, offset, options, dataLength);
            }
        default:
            {
                throw new Error('Invalid type!');
            }
    }
}
function isPLPStream(metadata) {
    switch(metadata.type.name){
        case 'VarChar':
        case 'NVarChar':
        case 'VarBinary':
            {
                return metadata.dataLength === MAX;
            }
        case 'Xml':
            {
                return true;
            }
        case 'UDT':
            {
                return true;
            }
    }
}
function readUniqueIdentifier(buf, offset, options) {
    let data;
    ({ value: data, offset } = readBinary(buf, offset, 0x10));
    return new _helpers.Result(options.lowerCaseGuids ? (0, _guidParser.bufferToLowerCaseGuid)(data) : (0, _guidParser.bufferToUpperCaseGuid)(data), offset);
}
function readNumeric(buf, offset, dataLength, _precision, scale) {
    let sign;
    ({ offset, value: sign } = (0, _helpers.readUInt8)(buf, offset));
    sign = sign === 1 ? 1 : -1;
    let value;
    if (dataLength === 5) {
        ({ offset, value } = (0, _helpers.readUInt32LE)(buf, offset));
    } else if (dataLength === 9) {
        ({ offset, value } = (0, _helpers.readUNumeric64LE)(buf, offset));
    } else if (dataLength === 13) {
        ({ offset, value } = (0, _helpers.readUNumeric96LE)(buf, offset));
    } else if (dataLength === 17) {
        ({ offset, value } = (0, _helpers.readUNumeric128LE)(buf, offset));
    } else {
        throw new Error((0, _sprintfJs.sprintf)('Unsupported numeric dataLength %d', dataLength));
    }
    return new _helpers.Result(value * sign / Math.pow(10, scale), offset);
}
function readVariant(buf, offset, options, dataLength) {
    let baseType;
    ({ value: baseType, offset } = (0, _helpers.readUInt8)(buf, offset));
    const type = _dataType.TYPE[baseType];
    let propBytes;
    ({ value: propBytes, offset } = (0, _helpers.readUInt8)(buf, offset));
    dataLength = dataLength - propBytes - 2;
    switch(type.name){
        case 'UniqueIdentifier':
            return readUniqueIdentifier(buf, offset, options);
        case 'Bit':
            return readBit(buf, offset);
        case 'TinyInt':
            return readTinyInt(buf, offset);
        case 'SmallInt':
            return readSmallInt(buf, offset);
        case 'Int':
            return readInt(buf, offset);
        case 'BigInt':
            return readBigInt(buf, offset);
        case 'SmallDateTime':
            return readSmallDateTime(buf, offset, options.useUTC);
        case 'DateTime':
            return readDateTime(buf, offset, options.useUTC);
        case 'Real':
            return readReal(buf, offset);
        case 'Float':
            return readFloat(buf, offset);
        case 'SmallMoney':
            return readSmallMoney(buf, offset);
        case 'Money':
            return readMoney(buf, offset);
        case 'Date':
            return readDate(buf, offset, options.useUTC);
        case 'Time':
            {
                let scale;
                ({ value: scale, offset } = (0, _helpers.readUInt8)(buf, offset));
                return readTime(buf, offset, dataLength, scale, options.useUTC);
            }
        case 'DateTime2':
            {
                let scale;
                ({ value: scale, offset } = (0, _helpers.readUInt8)(buf, offset));
                return readDateTime2(buf, offset, dataLength, scale, options.useUTC);
            }
        case 'DateTimeOffset':
            {
                let scale;
                ({ value: scale, offset } = (0, _helpers.readUInt8)(buf, offset));
                return readDateTimeOffset(buf, offset, dataLength, scale);
            }
        case 'VarBinary':
        case 'Binary':
            {
                // maxLength (unused?)
                ({ offset } = (0, _helpers.readUInt16LE)(buf, offset));
                return readBinary(buf, offset, dataLength);
            }
        case 'NumericN':
        case 'DecimalN':
            {
                let precision;
                ({ value: precision, offset } = (0, _helpers.readUInt8)(buf, offset));
                let scale;
                ({ value: scale, offset } = (0, _helpers.readUInt8)(buf, offset));
                return readNumeric(buf, offset, dataLength, precision, scale);
            }
        case 'VarChar':
        case 'Char':
            {
                // maxLength (unused?)
                ({ offset } = (0, _helpers.readUInt16LE)(buf, offset));
                let collation;
                ({ value: collation, offset } = (0, _metadataParser.readCollation)(buf, offset));
                return readChars(buf, offset, dataLength, collation.codepage);
            }
        case 'NVarChar':
        case 'NChar':
            {
                // maxLength (unused?)
                ({ offset } = (0, _helpers.readUInt16LE)(buf, offset));
                // collation (unused?)
                ({ offset } = (0, _metadataParser.readCollation)(buf, offset));
                return readNChars(buf, offset, dataLength);
            }
        default:
            throw new Error('Invalid type!');
    }
}
function readBinary(buf, offset, dataLength) {
    if (buf.length < offset + dataLength) {
        throw new _helpers.NotEnoughDataError(offset + dataLength);
    }
    return new _helpers.Result(buf.slice(offset, offset + dataLength), offset + dataLength);
}
function readChars(buf, offset, dataLength, codepage) {
    if (buf.length < offset + dataLength) {
        throw new _helpers.NotEnoughDataError(offset + dataLength);
    }
    return new _helpers.Result(_iconvLite.default.decode(buf.slice(offset, offset + dataLength), codepage ?? DEFAULT_ENCODING), offset + dataLength);
}
function readNChars(buf, offset, dataLength) {
    if (buf.length < offset + dataLength) {
        throw new _helpers.NotEnoughDataError(offset + dataLength);
    }
    return new _helpers.Result(buf.toString('ucs2', offset, offset + dataLength), offset + dataLength);
}
async function readPLPStream(parser) {
    while(parser.buffer.length < parser.position + 8){
        await parser.waitForChunk();
    }
    const expectedLength = parser.buffer.readBigUInt64LE(parser.position);
    parser.position += 8;
    if (expectedLength === PLP_NULL) {
        return null;
    }
    const chunks = [];
    let currentLength = 0;
    while(true){
        while(parser.buffer.length < parser.position + 4){
            await parser.waitForChunk();
        }
        const chunkLength = parser.buffer.readUInt32LE(parser.position);
        parser.position += 4;
        if (!chunkLength) {
            break;
        }
        while(parser.buffer.length < parser.position + chunkLength){
            await parser.waitForChunk();
        }
        chunks.push(parser.buffer.slice(parser.position, parser.position + chunkLength));
        parser.position += chunkLength;
        currentLength += chunkLength;
    }
    if (expectedLength !== UNKNOWN_PLP_LEN) {
        if (currentLength !== Number(expectedLength)) {
            throw new Error('Partially Length-prefixed Bytes unmatched lengths : expected ' + expectedLength + ', but got ' + currentLength + ' bytes');
        }
    }
    return chunks;
}
function readSmallDateTime(buf, offset, useUTC) {
    let days;
    ({ offset, value: days } = (0, _helpers.readUInt16LE)(buf, offset));
    let minutes;
    ({ offset, value: minutes } = (0, _helpers.readUInt16LE)(buf, offset));
    let value;
    if (useUTC) {
        value = new Date(Date.UTC(1900, 0, 1 + days, 0, minutes));
    } else {
        value = new Date(1900, 0, 1 + days, 0, minutes);
    }
    return new _helpers.Result(value, offset);
}
function readDateTime(buf, offset, useUTC) {
    let days;
    ({ offset, value: days } = (0, _helpers.readInt32LE)(buf, offset));
    let threeHundredthsOfSecond;
    ({ offset, value: threeHundredthsOfSecond } = (0, _helpers.readInt32LE)(buf, offset));
    const milliseconds = Math.round(threeHundredthsOfSecond * THREE_AND_A_THIRD);
    let value;
    if (useUTC) {
        value = new Date(Date.UTC(1900, 0, 1 + days, 0, 0, 0, milliseconds));
    } else {
        value = new Date(1900, 0, 1 + days, 0, 0, 0, milliseconds);
    }
    return new _helpers.Result(value, offset);
}
function readTime(buf, offset, dataLength, scale, useUTC) {
    let value;
    switch(dataLength){
        case 3:
            {
                ({ value, offset } = (0, _helpers.readUInt24LE)(buf, offset));
                break;
            }
        case 4:
            {
                ({ value, offset } = (0, _helpers.readUInt32LE)(buf, offset));
                break;
            }
        case 5:
            {
                ({ value, offset } = (0, _helpers.readUInt40LE)(buf, offset));
                break;
            }
        default:
            {
                throw new Error('unreachable');
            }
    }
    if (scale < 7) {
        for(let i = scale; i < 7; i++){
            value *= 10;
        }
    }
    let date;
    if (useUTC) {
        date = new Date(Date.UTC(1970, 0, 1, 0, 0, 0, value / 10000));
    } else {
        date = new Date(1970, 0, 1, 0, 0, 0, value / 10000);
    }
    Object.defineProperty(date, 'nanosecondsDelta', {
        enumerable: false,
        value: value % 10000 / Math.pow(10, 7)
    });
    return new _helpers.Result(date, offset);
}
function readDate(buf, offset, useUTC) {
    let days;
    ({ offset, value: days } = (0, _helpers.readUInt24LE)(buf, offset));
    if (useUTC) {
        return new _helpers.Result(new Date(Date.UTC(2000, 0, days - 730118)), offset);
    } else {
        return new _helpers.Result(new Date(2000, 0, days - 730118), offset);
    }
}
function readDateTime2(buf, offset, dataLength, scale, useUTC) {
    let time;
    ({ offset, value: time } = readTime(buf, offset, dataLength - 3, scale, useUTC));
    let days;
    ({ offset, value: days } = (0, _helpers.readUInt24LE)(buf, offset));
    let date;
    if (useUTC) {
        date = new Date(Date.UTC(2000, 0, days - 730118, 0, 0, 0, +time));
    } else {
        date = new Date(2000, 0, days - 730118, time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
    }
    Object.defineProperty(date, 'nanosecondsDelta', {
        enumerable: false,
        value: time.nanosecondsDelta
    });
    return new _helpers.Result(date, offset);
}
function readDateTimeOffset(buf, offset, dataLength, scale) {
    let time;
    ({ offset, value: time } = readTime(buf, offset, dataLength - 5, scale, true));
    let days;
    ({ offset, value: days } = (0, _helpers.readUInt24LE)(buf, offset));
    // time offset?
    ({ offset } = (0, _helpers.readUInt16LE)(buf, offset));
    const date = new Date(Date.UTC(2000, 0, days - 730118, 0, 0, 0, +time));
    Object.defineProperty(date, 'nanosecondsDelta', {
        enumerable: false,
        value: time.nanosecondsDelta
    });
    return new _helpers.Result(date, offset);
}
module.exports.readValue = readValue;
module.exports.isPLPStream = isPLPStream;
module.exports.readPLPStream = readPLPStream; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbWV0YWRhdGFQYXJzZXIiLCJyZXF1aXJlIiwiX2RhdGFUeXBlIiwiX2ljb252TGl0ZSIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJfc3ByaW50ZkpzIiwiX2d1aWRQYXJzZXIiLCJfaGVscGVycyIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsIk5VTEwiLCJNQVgiLCJUSFJFRV9BTkRfQV9USElSRCIsIk1PTkVZX0RJVklTT1IiLCJQTFBfTlVMTCIsIlVOS05PV05fUExQX0xFTiIsIkRFRkFVTFRfRU5DT0RJTkciLCJyZWFkVGlueUludCIsImJ1ZiIsIm9mZnNldCIsInJlYWRVSW50OCIsInJlYWRTbWFsbEludCIsInJlYWRJbnQxNkxFIiwicmVhZEludCIsInJlYWRJbnQzMkxFIiwicmVhZEJpZ0ludCIsInZhbHVlIiwicmVhZEJpZ0ludDY0TEUiLCJSZXN1bHQiLCJ0b1N0cmluZyIsInJlYWRSZWFsIiwicmVhZEZsb2F0TEUiLCJyZWFkRmxvYXQiLCJyZWFkRG91YmxlTEUiLCJyZWFkU21hbGxNb25leSIsInJlYWRNb25leSIsImhpZ2giLCJsb3ciLCJyZWFkVUludDMyTEUiLCJyZWFkQml0IiwicmVhZFZhbHVlIiwibWV0YWRhdGEiLCJvcHRpb25zIiwidHlwZSIsIm5hbWUiLCJkYXRhTGVuZ3RoIiwiRXJyb3IiLCJjb2RlcGFnZSIsImNvbGxhdGlvbiIsInJlYWRVSW50MTZMRSIsInJlYWRDaGFycyIsInJlYWROQ2hhcnMiLCJyZWFkQmluYXJ5IiwidGV4dFBvaW50ZXJMZW5ndGgiLCJyZWFkU21hbGxEYXRlVGltZSIsInVzZVVUQyIsInJlYWREYXRlVGltZSIsInJlYWRUaW1lIiwic2NhbGUiLCJyZWFkRGF0ZSIsInJlYWREYXRlVGltZTIiLCJyZWFkRGF0ZVRpbWVPZmZzZXQiLCJyZWFkTnVtZXJpYyIsInByZWNpc2lvbiIsInJlYWRVbmlxdWVJZGVudGlmaWVyIiwic3ByaW50ZiIsInJlYWRWYXJpYW50IiwiaXNQTFBTdHJlYW0iLCJkYXRhIiwibG93ZXJDYXNlR3VpZHMiLCJidWZmZXJUb0xvd2VyQ2FzZUd1aWQiLCJidWZmZXJUb1VwcGVyQ2FzZUd1aWQiLCJfcHJlY2lzaW9uIiwic2lnbiIsInJlYWRVTnVtZXJpYzY0TEUiLCJyZWFkVU51bWVyaWM5NkxFIiwicmVhZFVOdW1lcmljMTI4TEUiLCJNYXRoIiwicG93IiwiYmFzZVR5cGUiLCJUWVBFIiwicHJvcEJ5dGVzIiwicmVhZENvbGxhdGlvbiIsImxlbmd0aCIsIk5vdEVub3VnaERhdGFFcnJvciIsInNsaWNlIiwiaWNvbnYiLCJkZWNvZGUiLCJyZWFkUExQU3RyZWFtIiwicGFyc2VyIiwiYnVmZmVyIiwicG9zaXRpb24iLCJ3YWl0Rm9yQ2h1bmsiLCJleHBlY3RlZExlbmd0aCIsInJlYWRCaWdVSW50NjRMRSIsImNodW5rcyIsImN1cnJlbnRMZW5ndGgiLCJjaHVua0xlbmd0aCIsInB1c2giLCJOdW1iZXIiLCJkYXlzIiwibWludXRlcyIsIkRhdGUiLCJVVEMiLCJ0aHJlZUh1bmRyZWR0aHNPZlNlY29uZCIsIm1pbGxpc2Vjb25kcyIsInJvdW5kIiwicmVhZFVJbnQyNExFIiwicmVhZFVJbnQ0MExFIiwiaSIsImRhdGUiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJ0aW1lIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsImdldE1pbGxpc2Vjb25kcyIsIm5hbm9zZWNvbmRzRGVsdGEiLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiLi4vc3JjL3ZhbHVlLXBhcnNlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUGFyc2VyLCB7IHR5cGUgUGFyc2VyT3B0aW9ucyB9IGZyb20gJy4vdG9rZW4vc3RyZWFtLXBhcnNlcic7XG5pbXBvcnQgeyB0eXBlIE1ldGFkYXRhLCByZWFkQ29sbGF0aW9uIH0gZnJvbSAnLi9tZXRhZGF0YS1wYXJzZXInO1xuaW1wb3J0IHsgVFlQRSB9IGZyb20gJy4vZGF0YS10eXBlJztcblxuaW1wb3J0IGljb252IGZyb20gJ2ljb252LWxpdGUnO1xuaW1wb3J0IHsgc3ByaW50ZiB9IGZyb20gJ3NwcmludGYtanMnO1xuaW1wb3J0IHsgYnVmZmVyVG9Mb3dlckNhc2VHdWlkLCBidWZmZXJUb1VwcGVyQ2FzZUd1aWQgfSBmcm9tICcuL2d1aWQtcGFyc2VyJztcbmltcG9ydCB7IE5vdEVub3VnaERhdGFFcnJvciwgUmVzdWx0LCByZWFkQmlnSW50NjRMRSwgcmVhZERvdWJsZUxFLCByZWFkRmxvYXRMRSwgcmVhZEludDE2TEUsIHJlYWRJbnQzMkxFLCByZWFkVUludDE2TEUsIHJlYWRVSW50MzJMRSwgcmVhZFVJbnQ4LCByZWFkVUludDI0TEUsIHJlYWRVSW50NDBMRSwgcmVhZFVOdW1lcmljNjRMRSwgcmVhZFVOdW1lcmljOTZMRSwgcmVhZFVOdW1lcmljMTI4TEUgfSBmcm9tICcuL3Rva2VuL2hlbHBlcnMnO1xuXG5jb25zdCBOVUxMID0gKDEgPDwgMTYpIC0gMTtcbmNvbnN0IE1BWCA9ICgxIDw8IDE2KSAtIDE7XG5jb25zdCBUSFJFRV9BTkRfQV9USElSRCA9IDMgKyAoMSAvIDMpO1xuY29uc3QgTU9ORVlfRElWSVNPUiA9IDEwMDAwO1xuY29uc3QgUExQX05VTEwgPSAweEZGRkZGRkZGRkZGRkZGRkZuO1xuY29uc3QgVU5LTk9XTl9QTFBfTEVOID0gMHhGRkZGRkZGRkZGRkZGRkZFbjtcbmNvbnN0IERFRkFVTFRfRU5DT0RJTkcgPSAndXRmOCc7XG5cbmZ1bmN0aW9uIHJlYWRUaW55SW50KGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlcik6IFJlc3VsdDxudW1iZXI+IHtcbiAgcmV0dXJuIHJlYWRVSW50OChidWYsIG9mZnNldCk7XG59XG5cbmZ1bmN0aW9uIHJlYWRTbWFsbEludChidWY6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIpOiBSZXN1bHQ8bnVtYmVyPiB7XG4gIHJldHVybiByZWFkSW50MTZMRShidWYsIG9mZnNldCk7XG59XG5cbmZ1bmN0aW9uIHJlYWRJbnQoYnVmOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyKTogUmVzdWx0PG51bWJlcj4ge1xuICByZXR1cm4gcmVhZEludDMyTEUoYnVmLCBvZmZzZXQpO1xufVxuXG5mdW5jdGlvbiByZWFkQmlnSW50KGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlcik6IFJlc3VsdDxzdHJpbmc+IHtcbiAgbGV0IHZhbHVlO1xuICAoeyBvZmZzZXQsIHZhbHVlIH0gPSByZWFkQmlnSW50NjRMRShidWYsIG9mZnNldCkpO1xuXG4gIHJldHVybiBuZXcgUmVzdWx0KHZhbHVlLnRvU3RyaW5nKCksIG9mZnNldCk7XG59XG5cbmZ1bmN0aW9uIHJlYWRSZWFsKGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlcik6IFJlc3VsdDxudW1iZXI+IHtcbiAgcmV0dXJuIHJlYWRGbG9hdExFKGJ1Ziwgb2Zmc2V0KTtcbn1cblxuZnVuY3Rpb24gcmVhZEZsb2F0KGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlcik6IFJlc3VsdDxudW1iZXI+IHtcbiAgcmV0dXJuIHJlYWREb3VibGVMRShidWYsIG9mZnNldCk7XG59XG5cbmZ1bmN0aW9uIHJlYWRTbWFsbE1vbmV5KGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlcik6IFJlc3VsdDxudW1iZXI+IHtcbiAgbGV0IHZhbHVlO1xuICAoeyBvZmZzZXQsIHZhbHVlIH0gPSByZWFkSW50MzJMRShidWYsIG9mZnNldCkpO1xuXG4gIHJldHVybiBuZXcgUmVzdWx0KHZhbHVlIC8gTU9ORVlfRElWSVNPUiwgb2Zmc2V0KTtcbn1cblxuZnVuY3Rpb24gcmVhZE1vbmV5KGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlcik6IFJlc3VsdDxudW1iZXI+IHtcbiAgbGV0IGhpZ2g7XG4gICh7IG9mZnNldCwgdmFsdWU6IGhpZ2ggfSA9IHJlYWRJbnQzMkxFKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgbGV0IGxvdztcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogbG93IH0gPSByZWFkVUludDMyTEUoYnVmLCBvZmZzZXQpKTtcblxuICByZXR1cm4gbmV3IFJlc3VsdCgobG93ICsgKDB4MTAwMDAwMDAwICogaGlnaCkpIC8gTU9ORVlfRElWSVNPUiwgb2Zmc2V0KTtcbn1cblxuZnVuY3Rpb24gcmVhZEJpdChidWY6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIpOiBSZXN1bHQ8Ym9vbGVhbj4ge1xuICBsZXQgdmFsdWU7XG4gICh7IG9mZnNldCwgdmFsdWUgfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gIHJldHVybiBuZXcgUmVzdWx0KCEhdmFsdWUsIG9mZnNldCk7XG59XG5cbmZ1bmN0aW9uIHJlYWRWYWx1ZShidWY6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIsIG1ldGFkYXRhOiBNZXRhZGF0YSwgb3B0aW9uczogUGFyc2VyT3B0aW9ucyk6IFJlc3VsdDx1bmtub3duPiB7XG4gIGNvbnN0IHR5cGUgPSBtZXRhZGF0YS50eXBlO1xuXG4gIHN3aXRjaCAodHlwZS5uYW1lKSB7XG4gICAgY2FzZSAnTnVsbCc6XG4gICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuXG4gICAgY2FzZSAnVGlueUludCc6IHtcbiAgICAgIHJldHVybiByZWFkVGlueUludChidWYsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgY2FzZSAnU21hbGxJbnQnOiB7XG4gICAgICByZXR1cm4gcmVhZFNtYWxsSW50KGJ1Ziwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICBjYXNlICdJbnQnOiB7XG4gICAgICByZXR1cm4gcmVhZEludChidWYsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgY2FzZSAnQmlnSW50Jzoge1xuICAgICAgcmV0dXJuIHJlYWRCaWdJbnQoYnVmLCBvZmZzZXQpO1xuICAgIH1cblxuICAgIGNhc2UgJ0ludE4nOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gICAgICBzd2l0Y2ggKGRhdGFMZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHJldHVybiBuZXcgUmVzdWx0KG51bGwsIG9mZnNldCk7XG5cbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIHJldHVybiByZWFkVGlueUludChidWYsIG9mZnNldCk7XG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICByZXR1cm4gcmVhZFNtYWxsSW50KGJ1Ziwgb2Zmc2V0KTtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHJldHVybiByZWFkSW50KGJ1Ziwgb2Zmc2V0KTtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgIHJldHVybiByZWFkQmlnSW50KGJ1Ziwgb2Zmc2V0KTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgZGF0YUxlbmd0aCAnICsgZGF0YUxlbmd0aCArICcgZm9yIEludE4nKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjYXNlICdSZWFsJzoge1xuICAgICAgcmV0dXJuIHJlYWRSZWFsKGJ1Ziwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICBjYXNlICdGbG9hdCc6IHtcbiAgICAgIHJldHVybiByZWFkRmxvYXQoYnVmLCBvZmZzZXQpO1xuICAgIH1cblxuICAgIGNhc2UgJ0Zsb2F0Tic6IHtcbiAgICAgIGxldCBkYXRhTGVuZ3RoO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF0YUxlbmd0aCB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIHN3aXRjaCAoZGF0YUxlbmd0aCkge1xuICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgcmV0dXJuIG5ldyBSZXN1bHQobnVsbCwgb2Zmc2V0KTtcblxuICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgcmV0dXJuIHJlYWRSZWFsKGJ1Ziwgb2Zmc2V0KTtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgIHJldHVybiByZWFkRmxvYXQoYnVmLCBvZmZzZXQpO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbnN1cHBvcnRlZCBkYXRhTGVuZ3RoICcgKyBkYXRhTGVuZ3RoICsgJyBmb3IgRmxvYXROJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2FzZSAnU21hbGxNb25leSc6IHtcbiAgICAgIHJldHVybiByZWFkU21hbGxNb25leShidWYsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgY2FzZSAnTW9uZXknOlxuICAgICAgcmV0dXJuIHJlYWRNb25leShidWYsIG9mZnNldCk7XG5cbiAgICBjYXNlICdNb25leU4nOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gICAgICBzd2l0Y2ggKGRhdGFMZW5ndGgpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIHJldHVybiBuZXcgUmVzdWx0KG51bGwsIG9mZnNldCk7XG5cbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHJldHVybiByZWFkU21hbGxNb25leShidWYsIG9mZnNldCk7XG4gICAgICAgIGNhc2UgODpcbiAgICAgICAgICByZXR1cm4gcmVhZE1vbmV5KGJ1Ziwgb2Zmc2V0KTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgZGF0YUxlbmd0aCAnICsgZGF0YUxlbmd0aCArICcgZm9yIE1vbmV5TicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhc2UgJ0JpdCc6IHtcbiAgICAgIHJldHVybiByZWFkQml0KGJ1Ziwgb2Zmc2V0KTtcbiAgICB9XG5cbiAgICBjYXNlICdCaXROJzoge1xuICAgICAgbGV0IGRhdGFMZW5ndGg7XG4gICAgICAoeyBvZmZzZXQsIHZhbHVlOiBkYXRhTGVuZ3RoIH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgc3dpdGNoIChkYXRhTGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuXG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICByZXR1cm4gcmVhZEJpdChidWYsIG9mZnNldCk7XG5cbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vuc3VwcG9ydGVkIGRhdGFMZW5ndGggJyArIGRhdGFMZW5ndGggKyAnIGZvciBCaXROJyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2FzZSAnVmFyQ2hhcic6XG4gICAgY2FzZSAnQ2hhcic6IHtcbiAgICAgIGNvbnN0IGNvZGVwYWdlID0gbWV0YWRhdGEuY29sbGF0aW9uIS5jb2RlcGFnZSE7XG5cbiAgICAgIGxldCBkYXRhTGVuZ3RoO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF0YUxlbmd0aCB9ID0gcmVhZFVJbnQxNkxFKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIGlmIChkYXRhTGVuZ3RoID09PSBOVUxMKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzdWx0KG51bGwsIG9mZnNldCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZWFkQ2hhcnMoYnVmLCBvZmZzZXQsIGRhdGFMZW5ndGgsIGNvZGVwYWdlKTtcbiAgICB9XG5cbiAgICBjYXNlICdOVmFyQ2hhcic6XG4gICAgY2FzZSAnTkNoYXInOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50MTZMRShidWYsIG9mZnNldCkpO1xuXG4gICAgICBpZiAoZGF0YUxlbmd0aCA9PT0gTlVMTCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhZE5DaGFycyhidWYsIG9mZnNldCwgZGF0YUxlbmd0aCk7XG4gICAgfVxuXG4gICAgY2FzZSAnVmFyQmluYXJ5JzpcbiAgICBjYXNlICdCaW5hcnknOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50MTZMRShidWYsIG9mZnNldCkpO1xuXG4gICAgICBpZiAoZGF0YUxlbmd0aCA9PT0gTlVMTCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhZEJpbmFyeShidWYsIG9mZnNldCwgZGF0YUxlbmd0aCk7XG4gICAgfVxuXG4gICAgY2FzZSAnVGV4dCc6IHtcbiAgICAgIGxldCB0ZXh0UG9pbnRlckxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IHRleHRQb2ludGVyTGVuZ3RoIH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgaWYgKHRleHRQb2ludGVyTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzdWx0KG51bGwsIG9mZnNldCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRleHRwb2ludGVyXG4gICAgICAoeyBvZmZzZXQgfSA9IHJlYWRCaW5hcnkoYnVmLCBvZmZzZXQsIHRleHRQb2ludGVyTGVuZ3RoKSk7XG5cbiAgICAgIC8vIFRpbWVzdGFtcFxuICAgICAgKHsgb2Zmc2V0IH0gPSByZWFkQmluYXJ5KGJ1Ziwgb2Zmc2V0LCA4KSk7XG5cbiAgICAgIGxldCBkYXRhTGVuZ3RoO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF0YUxlbmd0aCB9ID0gcmVhZFVJbnQzMkxFKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIHJldHVybiByZWFkQ2hhcnMoYnVmLCBvZmZzZXQsIGRhdGFMZW5ndGgsIG1ldGFkYXRhLmNvbGxhdGlvbiEuY29kZXBhZ2UhKTtcbiAgICB9XG5cbiAgICBjYXNlICdOVGV4dCc6IHtcbiAgICAgIGxldCB0ZXh0UG9pbnRlckxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IHRleHRQb2ludGVyTGVuZ3RoIH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgaWYgKHRleHRQb2ludGVyTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzdWx0KG51bGwsIG9mZnNldCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRleHRwb2ludGVyXG4gICAgICAoeyBvZmZzZXQgfSA9IHJlYWRCaW5hcnkoYnVmLCBvZmZzZXQsIHRleHRQb2ludGVyTGVuZ3RoKSk7XG5cbiAgICAgIC8vIFRpbWVzdGFtcFxuICAgICAgKHsgb2Zmc2V0IH0gPSByZWFkQmluYXJ5KGJ1Ziwgb2Zmc2V0LCA4KSk7XG5cbiAgICAgIGxldCBkYXRhTGVuZ3RoO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF0YUxlbmd0aCB9ID0gcmVhZFVJbnQzMkxFKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIHJldHVybiByZWFkTkNoYXJzKGJ1Ziwgb2Zmc2V0LCBkYXRhTGVuZ3RoKTtcbiAgICB9XG5cbiAgICBjYXNlICdJbWFnZSc6IHtcbiAgICAgIGxldCB0ZXh0UG9pbnRlckxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IHRleHRQb2ludGVyTGVuZ3RoIH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgaWYgKHRleHRQb2ludGVyTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzdWx0KG51bGwsIG9mZnNldCk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRleHRwb2ludGVyXG4gICAgICAoeyBvZmZzZXQgfSA9IHJlYWRCaW5hcnkoYnVmLCBvZmZzZXQsIHRleHRQb2ludGVyTGVuZ3RoKSk7XG5cbiAgICAgIC8vIFRpbWVzdGFtcFxuICAgICAgKHsgb2Zmc2V0IH0gPSByZWFkQmluYXJ5KGJ1Ziwgb2Zmc2V0LCA4KSk7XG5cbiAgICAgIGxldCBkYXRhTGVuZ3RoO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF0YUxlbmd0aCB9ID0gcmVhZFVJbnQzMkxFKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIHJldHVybiByZWFkQmluYXJ5KGJ1Ziwgb2Zmc2V0LCBkYXRhTGVuZ3RoKTtcbiAgICB9XG5cbiAgICBjYXNlICdTbWFsbERhdGVUaW1lJzoge1xuICAgICAgcmV0dXJuIHJlYWRTbWFsbERhdGVUaW1lKGJ1Ziwgb2Zmc2V0LCBvcHRpb25zLnVzZVVUQyk7XG4gICAgfVxuXG4gICAgY2FzZSAnRGF0ZVRpbWUnOiB7XG4gICAgICByZXR1cm4gcmVhZERhdGVUaW1lKGJ1Ziwgb2Zmc2V0LCBvcHRpb25zLnVzZVVUQyk7XG4gICAgfVxuXG4gICAgY2FzZSAnRGF0ZVRpbWVOJzoge1xuICAgICAgbGV0IGRhdGFMZW5ndGg7XG4gICAgICAoeyBvZmZzZXQsIHZhbHVlOiBkYXRhTGVuZ3RoIH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgc3dpdGNoIChkYXRhTGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICByZXR1cm4gcmVhZFNtYWxsRGF0ZVRpbWUoYnVmLCBvZmZzZXQsIG9wdGlvbnMudXNlVVRDKTtcbiAgICAgICAgY2FzZSA4OlxuICAgICAgICAgIHJldHVybiByZWFkRGF0ZVRpbWUoYnVmLCBvZmZzZXQsIG9wdGlvbnMudXNlVVRDKTtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVW5zdXBwb3J0ZWQgZGF0YUxlbmd0aCAnICsgZGF0YUxlbmd0aCArICcgZm9yIERhdGVUaW1lTicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhc2UgJ1RpbWUnOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gICAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhZFRpbWUoYnVmLCBvZmZzZXQsIGRhdGFMZW5ndGgsIG1ldGFkYXRhLnNjYWxlISwgb3B0aW9ucy51c2VVVEMpO1xuICAgIH1cblxuICAgIGNhc2UgJ0RhdGUnOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gICAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhZERhdGUoYnVmLCBvZmZzZXQsIG9wdGlvbnMudXNlVVRDKTtcbiAgICB9XG5cbiAgICBjYXNlICdEYXRlVGltZTInOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gICAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhZERhdGVUaW1lMihidWYsIG9mZnNldCwgZGF0YUxlbmd0aCwgbWV0YWRhdGEuc2NhbGUhLCBvcHRpb25zLnVzZVVUQyk7XG4gICAgfVxuXG4gICAgY2FzZSAnRGF0ZVRpbWVPZmZzZXQnOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gICAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhZERhdGVUaW1lT2Zmc2V0KGJ1Ziwgb2Zmc2V0LCBkYXRhTGVuZ3RoLCBtZXRhZGF0YS5zY2FsZSEpO1xuICAgIH1cblxuICAgIGNhc2UgJ051bWVyaWNOJzpcbiAgICBjYXNlICdEZWNpbWFsTic6IHtcbiAgICAgIGxldCBkYXRhTGVuZ3RoO1xuICAgICAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF0YUxlbmd0aCB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIGlmIChkYXRhTGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBuZXcgUmVzdWx0KG51bGwsIG9mZnNldCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZWFkTnVtZXJpYyhidWYsIG9mZnNldCwgZGF0YUxlbmd0aCwgbWV0YWRhdGEucHJlY2lzaW9uISwgbWV0YWRhdGEuc2NhbGUhKTtcbiAgICB9XG5cbiAgICBjYXNlICdVbmlxdWVJZGVudGlmaWVyJzoge1xuICAgICAgbGV0IGRhdGFMZW5ndGg7XG4gICAgICAoeyBvZmZzZXQsIHZhbHVlOiBkYXRhTGVuZ3RoIH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgc3dpdGNoIChkYXRhTGVuZ3RoKSB7XG4gICAgICAgIGNhc2UgMDpcbiAgICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuXG4gICAgICAgIGNhc2UgMHgxMDpcbiAgICAgICAgICByZXR1cm4gcmVhZFVuaXF1ZUlkZW50aWZpZXIoYnVmLCBvZmZzZXQsIG9wdGlvbnMpO1xuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHNwcmludGYoJ1Vuc3VwcG9ydGVkIGd1aWQgc2l6ZSAlZCcsIGRhdGFMZW5ndGghIC0gMSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNhc2UgJ1ZhcmlhbnQnOiB7XG4gICAgICBsZXQgZGF0YUxlbmd0aDtcbiAgICAgICh7IG9mZnNldCwgdmFsdWU6IGRhdGFMZW5ndGggfSA9IHJlYWRVSW50MzJMRShidWYsIG9mZnNldCkpO1xuXG4gICAgICBpZiAoZGF0YUxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbmV3IFJlc3VsdChudWxsLCBvZmZzZXQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVhZFZhcmlhbnQoYnVmLCBvZmZzZXQsIG9wdGlvbnMsIGRhdGFMZW5ndGgpO1xuICAgIH1cblxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0eXBlIScpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBpc1BMUFN0cmVhbShtZXRhZGF0YTogTWV0YWRhdGEpIHtcbiAgc3dpdGNoIChtZXRhZGF0YS50eXBlLm5hbWUpIHtcbiAgICBjYXNlICdWYXJDaGFyJzpcbiAgICBjYXNlICdOVmFyQ2hhcic6XG4gICAgY2FzZSAnVmFyQmluYXJ5Jzoge1xuICAgICAgcmV0dXJuIG1ldGFkYXRhLmRhdGFMZW5ndGggPT09IE1BWDtcbiAgICB9XG5cbiAgICBjYXNlICdYbWwnOiB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBjYXNlICdVRFQnOiB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVhZFVuaXF1ZUlkZW50aWZpZXIoYnVmOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCBvcHRpb25zOiBQYXJzZXJPcHRpb25zKTogUmVzdWx0PHN0cmluZz4ge1xuICBsZXQgZGF0YTtcbiAgKHsgdmFsdWU6IGRhdGEsIG9mZnNldCB9ID0gcmVhZEJpbmFyeShidWYsIG9mZnNldCwgMHgxMCkpO1xuXG4gIHJldHVybiBuZXcgUmVzdWx0KG9wdGlvbnMubG93ZXJDYXNlR3VpZHMgPyBidWZmZXJUb0xvd2VyQ2FzZUd1aWQoZGF0YSkgOiBidWZmZXJUb1VwcGVyQ2FzZUd1aWQoZGF0YSksIG9mZnNldCk7XG59XG5cbmZ1bmN0aW9uIHJlYWROdW1lcmljKGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciwgZGF0YUxlbmd0aDogbnVtYmVyLCBfcHJlY2lzaW9uOiBudW1iZXIsIHNjYWxlOiBudW1iZXIpOiBSZXN1bHQ8bnVtYmVyPiB7XG4gIGxldCBzaWduO1xuICAoeyBvZmZzZXQsIHZhbHVlOiBzaWduIH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICBzaWduID0gc2lnbiA9PT0gMSA/IDEgOiAtMTtcblxuICBsZXQgdmFsdWU7XG4gIGlmIChkYXRhTGVuZ3RoID09PSA1KSB7XG4gICAgKHsgb2Zmc2V0LCB2YWx1ZSB9ID0gcmVhZFVJbnQzMkxFKGJ1Ziwgb2Zmc2V0KSk7XG4gIH0gZWxzZSBpZiAoZGF0YUxlbmd0aCA9PT0gOSkge1xuICAgICh7IG9mZnNldCwgdmFsdWUgfSA9IHJlYWRVTnVtZXJpYzY0TEUoYnVmLCBvZmZzZXQpKTtcbiAgfSBlbHNlIGlmIChkYXRhTGVuZ3RoID09PSAxMykge1xuICAgICh7IG9mZnNldCwgdmFsdWUgfSA9IHJlYWRVTnVtZXJpYzk2TEUoYnVmLCBvZmZzZXQpKTtcbiAgfSBlbHNlIGlmIChkYXRhTGVuZ3RoID09PSAxNykge1xuICAgICh7IG9mZnNldCwgdmFsdWUgfSA9IHJlYWRVTnVtZXJpYzEyOExFKGJ1Ziwgb2Zmc2V0KSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKHNwcmludGYoJ1Vuc3VwcG9ydGVkIG51bWVyaWMgZGF0YUxlbmd0aCAlZCcsIGRhdGFMZW5ndGgpKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzdWx0KCh2YWx1ZSAqIHNpZ24pIC8gTWF0aC5wb3coMTAsIHNjYWxlKSwgb2Zmc2V0KTtcbn1cblxuZnVuY3Rpb24gcmVhZFZhcmlhbnQoYnVmOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCBvcHRpb25zOiBQYXJzZXJPcHRpb25zLCBkYXRhTGVuZ3RoOiBudW1iZXIpOiBSZXN1bHQ8dW5rbm93bj4ge1xuICBsZXQgYmFzZVR5cGU7XG4gICh7IHZhbHVlOiBiYXNlVHlwZSwgb2Zmc2V0IH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICBjb25zdCB0eXBlID0gVFlQRVtiYXNlVHlwZV07XG5cbiAgbGV0IHByb3BCeXRlcztcbiAgKHsgdmFsdWU6IHByb3BCeXRlcywgb2Zmc2V0IH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICBkYXRhTGVuZ3RoID0gZGF0YUxlbmd0aCAtIHByb3BCeXRlcyAtIDI7XG5cbiAgc3dpdGNoICh0eXBlLm5hbWUpIHtcbiAgICBjYXNlICdVbmlxdWVJZGVudGlmaWVyJzpcbiAgICAgIHJldHVybiByZWFkVW5pcXVlSWRlbnRpZmllcihidWYsIG9mZnNldCwgb3B0aW9ucyk7XG5cbiAgICBjYXNlICdCaXQnOlxuICAgICAgcmV0dXJuIHJlYWRCaXQoYnVmLCBvZmZzZXQpO1xuXG4gICAgY2FzZSAnVGlueUludCc6XG4gICAgICByZXR1cm4gcmVhZFRpbnlJbnQoYnVmLCBvZmZzZXQpO1xuXG4gICAgY2FzZSAnU21hbGxJbnQnOlxuICAgICAgcmV0dXJuIHJlYWRTbWFsbEludChidWYsIG9mZnNldCk7XG5cbiAgICBjYXNlICdJbnQnOlxuICAgICAgcmV0dXJuIHJlYWRJbnQoYnVmLCBvZmZzZXQpO1xuXG4gICAgY2FzZSAnQmlnSW50JzpcbiAgICAgIHJldHVybiByZWFkQmlnSW50KGJ1Ziwgb2Zmc2V0KTtcblxuICAgIGNhc2UgJ1NtYWxsRGF0ZVRpbWUnOlxuICAgICAgcmV0dXJuIHJlYWRTbWFsbERhdGVUaW1lKGJ1Ziwgb2Zmc2V0LCBvcHRpb25zLnVzZVVUQyk7XG5cbiAgICBjYXNlICdEYXRlVGltZSc6XG4gICAgICByZXR1cm4gcmVhZERhdGVUaW1lKGJ1Ziwgb2Zmc2V0LCBvcHRpb25zLnVzZVVUQyk7XG5cbiAgICBjYXNlICdSZWFsJzpcbiAgICAgIHJldHVybiByZWFkUmVhbChidWYsIG9mZnNldCk7XG5cbiAgICBjYXNlICdGbG9hdCc6XG4gICAgICByZXR1cm4gcmVhZEZsb2F0KGJ1Ziwgb2Zmc2V0KTtcblxuICAgIGNhc2UgJ1NtYWxsTW9uZXknOlxuICAgICAgcmV0dXJuIHJlYWRTbWFsbE1vbmV5KGJ1Ziwgb2Zmc2V0KTtcblxuICAgIGNhc2UgJ01vbmV5JzpcbiAgICAgIHJldHVybiByZWFkTW9uZXkoYnVmLCBvZmZzZXQpO1xuXG4gICAgY2FzZSAnRGF0ZSc6XG4gICAgICByZXR1cm4gcmVhZERhdGUoYnVmLCBvZmZzZXQsIG9wdGlvbnMudXNlVVRDKTtcblxuICAgIGNhc2UgJ1RpbWUnOiB7XG4gICAgICBsZXQgc2NhbGU7XG4gICAgICAoeyB2YWx1ZTogc2NhbGUsIG9mZnNldCB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIHJldHVybiByZWFkVGltZShidWYsIG9mZnNldCwgZGF0YUxlbmd0aCwgc2NhbGUsIG9wdGlvbnMudXNlVVRDKTtcbiAgICB9XG5cbiAgICBjYXNlICdEYXRlVGltZTInOiB7XG4gICAgICBsZXQgc2NhbGU7XG4gICAgICAoeyB2YWx1ZTogc2NhbGUsIG9mZnNldCB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIHJldHVybiByZWFkRGF0ZVRpbWUyKGJ1Ziwgb2Zmc2V0LCBkYXRhTGVuZ3RoLCBzY2FsZSwgb3B0aW9ucy51c2VVVEMpO1xuICAgIH1cblxuICAgIGNhc2UgJ0RhdGVUaW1lT2Zmc2V0Jzoge1xuICAgICAgbGV0IHNjYWxlO1xuICAgICAgKHsgdmFsdWU6IHNjYWxlLCBvZmZzZXQgfSA9IHJlYWRVSW50OChidWYsIG9mZnNldCkpO1xuXG4gICAgICByZXR1cm4gcmVhZERhdGVUaW1lT2Zmc2V0KGJ1Ziwgb2Zmc2V0LCBkYXRhTGVuZ3RoLCBzY2FsZSk7XG4gICAgfVxuXG4gICAgY2FzZSAnVmFyQmluYXJ5JzpcbiAgICBjYXNlICdCaW5hcnknOiB7XG4gICAgICAvLyBtYXhMZW5ndGggKHVudXNlZD8pXG4gICAgICAoeyBvZmZzZXQgfSA9IHJlYWRVSW50MTZMRShidWYsIG9mZnNldCkpO1xuXG4gICAgICByZXR1cm4gcmVhZEJpbmFyeShidWYsIG9mZnNldCwgZGF0YUxlbmd0aCk7XG4gICAgfVxuXG4gICAgY2FzZSAnTnVtZXJpY04nOlxuICAgIGNhc2UgJ0RlY2ltYWxOJzoge1xuICAgICAgbGV0IHByZWNpc2lvbjtcbiAgICAgICh7IHZhbHVlOiBwcmVjaXNpb24sIG9mZnNldCB9ID0gcmVhZFVJbnQ4KGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgICAgIGxldCBzY2FsZTtcbiAgICAgICh7IHZhbHVlOiBzY2FsZSwgb2Zmc2V0IH0gPSByZWFkVUludDgoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgcmV0dXJuIHJlYWROdW1lcmljKGJ1Ziwgb2Zmc2V0LCBkYXRhTGVuZ3RoLCBwcmVjaXNpb24sIHNjYWxlKTtcbiAgICB9XG5cbiAgICBjYXNlICdWYXJDaGFyJzpcbiAgICBjYXNlICdDaGFyJzoge1xuICAgICAgLy8gbWF4TGVuZ3RoICh1bnVzZWQ/KVxuICAgICAgKHsgb2Zmc2V0IH0gPSByZWFkVUludDE2TEUoYnVmLCBvZmZzZXQpKTtcblxuICAgICAgbGV0IGNvbGxhdGlvbjtcbiAgICAgICh7IHZhbHVlOiBjb2xsYXRpb24sIG9mZnNldCB9ID0gcmVhZENvbGxhdGlvbihidWYsIG9mZnNldCkpO1xuXG4gICAgICByZXR1cm4gcmVhZENoYXJzKGJ1Ziwgb2Zmc2V0LCBkYXRhTGVuZ3RoLCBjb2xsYXRpb24uY29kZXBhZ2UhKTtcbiAgICB9XG5cbiAgICBjYXNlICdOVmFyQ2hhcic6XG4gICAgY2FzZSAnTkNoYXInOiB7XG4gICAgICAvLyBtYXhMZW5ndGggKHVudXNlZD8pXG4gICAgICAoeyBvZmZzZXQgfSA9IHJlYWRVSW50MTZMRShidWYsIG9mZnNldCkpO1xuXG4gICAgICAvLyBjb2xsYXRpb24gKHVudXNlZD8pXG4gICAgICAoeyBvZmZzZXQgfSA9IHJlYWRDb2xsYXRpb24oYnVmLCBvZmZzZXQpKTtcblxuICAgICAgcmV0dXJuIHJlYWROQ2hhcnMoYnVmLCBvZmZzZXQsIGRhdGFMZW5ndGgpO1xuICAgIH1cblxuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdHlwZSEnKTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWFkQmluYXJ5KGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciwgZGF0YUxlbmd0aDogbnVtYmVyKTogUmVzdWx0PEJ1ZmZlcj4ge1xuICBpZiAoYnVmLmxlbmd0aCA8IG9mZnNldCArIGRhdGFMZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgTm90RW5vdWdoRGF0YUVycm9yKG9mZnNldCArIGRhdGFMZW5ndGgpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBSZXN1bHQoYnVmLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZGF0YUxlbmd0aCksIG9mZnNldCArIGRhdGFMZW5ndGgpO1xufVxuXG5mdW5jdGlvbiByZWFkQ2hhcnMoYnVmOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCBkYXRhTGVuZ3RoOiBudW1iZXIsIGNvZGVwYWdlOiBzdHJpbmcpOiBSZXN1bHQ8c3RyaW5nPiB7XG4gIGlmIChidWYubGVuZ3RoIDwgb2Zmc2V0ICsgZGF0YUxlbmd0aCkge1xuICAgIHRocm93IG5ldyBOb3RFbm91Z2hEYXRhRXJyb3Iob2Zmc2V0ICsgZGF0YUxlbmd0aCk7XG4gIH1cblxuICByZXR1cm4gbmV3IFJlc3VsdChpY29udi5kZWNvZGUoYnVmLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgZGF0YUxlbmd0aCksIGNvZGVwYWdlID8/IERFRkFVTFRfRU5DT0RJTkcpLCBvZmZzZXQgKyBkYXRhTGVuZ3RoKTtcbn1cblxuZnVuY3Rpb24gcmVhZE5DaGFycyhidWY6IEJ1ZmZlciwgb2Zmc2V0OiBudW1iZXIsIGRhdGFMZW5ndGg6IG51bWJlcik6IFJlc3VsdDxzdHJpbmc+IHtcbiAgaWYgKGJ1Zi5sZW5ndGggPCBvZmZzZXQgKyBkYXRhTGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IE5vdEVub3VnaERhdGFFcnJvcihvZmZzZXQgKyBkYXRhTGVuZ3RoKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzdWx0KGJ1Zi50b1N0cmluZygndWNzMicsIG9mZnNldCwgb2Zmc2V0ICsgZGF0YUxlbmd0aCksIG9mZnNldCArIGRhdGFMZW5ndGgpO1xufVxuXG5hc3luYyBmdW5jdGlvbiByZWFkUExQU3RyZWFtKHBhcnNlcjogUGFyc2VyKTogUHJvbWlzZTxudWxsIHwgQnVmZmVyW10+IHtcbiAgd2hpbGUgKHBhcnNlci5idWZmZXIubGVuZ3RoIDwgcGFyc2VyLnBvc2l0aW9uICsgOCkge1xuICAgIGF3YWl0IHBhcnNlci53YWl0Rm9yQ2h1bmsoKTtcbiAgfVxuXG4gIGNvbnN0IGV4cGVjdGVkTGVuZ3RoID0gcGFyc2VyLmJ1ZmZlci5yZWFkQmlnVUludDY0TEUocGFyc2VyLnBvc2l0aW9uKTtcbiAgcGFyc2VyLnBvc2l0aW9uICs9IDg7XG5cbiAgaWYgKGV4cGVjdGVkTGVuZ3RoID09PSBQTFBfTlVMTCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgY29uc3QgY2h1bmtzOiBCdWZmZXJbXSA9IFtdO1xuICBsZXQgY3VycmVudExlbmd0aCA9IDA7XG5cbiAgd2hpbGUgKHRydWUpIHtcbiAgICB3aGlsZSAocGFyc2VyLmJ1ZmZlci5sZW5ndGggPCBwYXJzZXIucG9zaXRpb24gKyA0KSB7XG4gICAgICBhd2FpdCBwYXJzZXIud2FpdEZvckNodW5rKCk7XG4gICAgfVxuXG4gICAgY29uc3QgY2h1bmtMZW5ndGggPSBwYXJzZXIuYnVmZmVyLnJlYWRVSW50MzJMRShwYXJzZXIucG9zaXRpb24pO1xuICAgIHBhcnNlci5wb3NpdGlvbiArPSA0O1xuXG4gICAgaWYgKCFjaHVua0xlbmd0aCkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgd2hpbGUgKHBhcnNlci5idWZmZXIubGVuZ3RoIDwgcGFyc2VyLnBvc2l0aW9uICsgY2h1bmtMZW5ndGgpIHtcbiAgICAgIGF3YWl0IHBhcnNlci53YWl0Rm9yQ2h1bmsoKTtcbiAgICB9XG5cbiAgICBjaHVua3MucHVzaChwYXJzZXIuYnVmZmVyLnNsaWNlKHBhcnNlci5wb3NpdGlvbiwgcGFyc2VyLnBvc2l0aW9uICsgY2h1bmtMZW5ndGgpKTtcbiAgICBwYXJzZXIucG9zaXRpb24gKz0gY2h1bmtMZW5ndGg7XG4gICAgY3VycmVudExlbmd0aCArPSBjaHVua0xlbmd0aDtcbiAgfVxuXG4gIGlmIChleHBlY3RlZExlbmd0aCAhPT0gVU5LTk9XTl9QTFBfTEVOKSB7XG4gICAgaWYgKGN1cnJlbnRMZW5ndGggIT09IE51bWJlcihleHBlY3RlZExlbmd0aCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUGFydGlhbGx5IExlbmd0aC1wcmVmaXhlZCBCeXRlcyB1bm1hdGNoZWQgbGVuZ3RocyA6IGV4cGVjdGVkICcgKyBleHBlY3RlZExlbmd0aCArICcsIGJ1dCBnb3QgJyArIGN1cnJlbnRMZW5ndGggKyAnIGJ5dGVzJyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNodW5rcztcbn1cblxuZnVuY3Rpb24gcmVhZFNtYWxsRGF0ZVRpbWUoYnVmOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCB1c2VVVEM6IGJvb2xlYW4pOiBSZXN1bHQ8RGF0ZT4ge1xuICBsZXQgZGF5cztcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF5cyB9ID0gcmVhZFVJbnQxNkxFKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgbGV0IG1pbnV0ZXM7XG4gICh7IG9mZnNldCwgdmFsdWU6IG1pbnV0ZXMgfSA9IHJlYWRVSW50MTZMRShidWYsIG9mZnNldCkpO1xuXG4gIGxldCB2YWx1ZTtcbiAgaWYgKHVzZVVUQykge1xuICAgIHZhbHVlID0gbmV3IERhdGUoRGF0ZS5VVEMoMTkwMCwgMCwgMSArIGRheXMsIDAsIG1pbnV0ZXMpKTtcbiAgfSBlbHNlIHtcbiAgICB2YWx1ZSA9IG5ldyBEYXRlKDE5MDAsIDAsIDEgKyBkYXlzLCAwLCBtaW51dGVzKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzdWx0KHZhbHVlLCBvZmZzZXQpO1xufVxuXG5mdW5jdGlvbiByZWFkRGF0ZVRpbWUoYnVmOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCB1c2VVVEM6IGJvb2xlYW4pOiBSZXN1bHQ8RGF0ZT4ge1xuICBsZXQgZGF5cztcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF5cyB9ID0gcmVhZEludDMyTEUoYnVmLCBvZmZzZXQpKTtcblxuICBsZXQgdGhyZWVIdW5kcmVkdGhzT2ZTZWNvbmQ7XG4gICh7IG9mZnNldCwgdmFsdWU6IHRocmVlSHVuZHJlZHRoc09mU2Vjb25kIH0gPSByZWFkSW50MzJMRShidWYsIG9mZnNldCkpO1xuXG4gIGNvbnN0IG1pbGxpc2Vjb25kcyA9IE1hdGgucm91bmQodGhyZWVIdW5kcmVkdGhzT2ZTZWNvbmQgKiBUSFJFRV9BTkRfQV9USElSRCk7XG5cbiAgbGV0IHZhbHVlO1xuICBpZiAodXNlVVRDKSB7XG4gICAgdmFsdWUgPSBuZXcgRGF0ZShEYXRlLlVUQygxOTAwLCAwLCAxICsgZGF5cywgMCwgMCwgMCwgbWlsbGlzZWNvbmRzKSk7XG4gIH0gZWxzZSB7XG4gICAgdmFsdWUgPSBuZXcgRGF0ZSgxOTAwLCAwLCAxICsgZGF5cywgMCwgMCwgMCwgbWlsbGlzZWNvbmRzKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUmVzdWx0KHZhbHVlLCBvZmZzZXQpO1xufVxuXG5pbnRlcmZhY2UgRGF0ZVdpdGhOYW5vc2Vjb25kc0RlbHRhIGV4dGVuZHMgRGF0ZSB7XG4gIG5hbm9zZWNvbmRzRGVsdGE6IG51bWJlcjtcbn1cblxuZnVuY3Rpb24gcmVhZFRpbWUoYnVmOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCBkYXRhTGVuZ3RoOiBudW1iZXIsIHNjYWxlOiBudW1iZXIsIHVzZVVUQzogYm9vbGVhbik6IFJlc3VsdDxEYXRlV2l0aE5hbm9zZWNvbmRzRGVsdGE+IHtcbiAgbGV0IHZhbHVlO1xuXG4gIHN3aXRjaCAoZGF0YUxlbmd0aCkge1xuICAgIGNhc2UgMzoge1xuICAgICAgKHsgdmFsdWUsIG9mZnNldCB9ID0gcmVhZFVJbnQyNExFKGJ1Ziwgb2Zmc2V0KSk7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBjYXNlIDQ6IHtcbiAgICAgICh7IHZhbHVlLCBvZmZzZXQgfSA9IHJlYWRVSW50MzJMRShidWYsIG9mZnNldCkpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY2FzZSA1OiB7XG4gICAgICAoeyB2YWx1ZSwgb2Zmc2V0IH0gPSByZWFkVUludDQwTEUoYnVmLCBvZmZzZXQpKTtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGRlZmF1bHQ6IHtcbiAgICAgIHRocm93IG5ldyBFcnJvcigndW5yZWFjaGFibGUnKTtcbiAgICB9XG4gIH1cblxuICBpZiAoc2NhbGUgPCA3KSB7XG4gICAgZm9yIChsZXQgaSA9IHNjYWxlOyBpIDwgNzsgaSsrKSB7XG4gICAgICB2YWx1ZSAqPSAxMDtcbiAgICB9XG4gIH1cblxuICBsZXQgZGF0ZTtcbiAgaWYgKHVzZVVUQykge1xuICAgIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQygxOTcwLCAwLCAxLCAwLCAwLCAwLCB2YWx1ZSAvIDEwMDAwKSkgYXMgRGF0ZVdpdGhOYW5vc2Vjb25kc0RlbHRhO1xuICB9IGVsc2Uge1xuICAgIGRhdGUgPSBuZXcgRGF0ZSgxOTcwLCAwLCAxLCAwLCAwLCAwLCB2YWx1ZSAvIDEwMDAwKSBhcyBEYXRlV2l0aE5hbm9zZWNvbmRzRGVsdGE7XG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRhdGUsICduYW5vc2Vjb25kc0RlbHRhJywge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHZhbHVlOiAodmFsdWUgJSAxMDAwMCkgLyBNYXRoLnBvdygxMCwgNylcbiAgfSk7XG5cbiAgcmV0dXJuIG5ldyBSZXN1bHQoZGF0ZSwgb2Zmc2V0KTtcbn1cblxuZnVuY3Rpb24gcmVhZERhdGUoYnVmOiBCdWZmZXIsIG9mZnNldDogbnVtYmVyLCB1c2VVVEM6IGJvb2xlYW4pOiBSZXN1bHQ8RGF0ZT4ge1xuICBsZXQgZGF5cztcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF5cyB9ID0gcmVhZFVJbnQyNExFKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgaWYgKHVzZVVUQykge1xuICAgIHJldHVybiBuZXcgUmVzdWx0KG5ldyBEYXRlKERhdGUuVVRDKDIwMDAsIDAsIGRheXMgLSA3MzAxMTgpKSwgb2Zmc2V0KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IFJlc3VsdChuZXcgRGF0ZSgyMDAwLCAwLCBkYXlzIC0gNzMwMTE4KSwgb2Zmc2V0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZWFkRGF0ZVRpbWUyKGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciwgZGF0YUxlbmd0aDogbnVtYmVyLCBzY2FsZTogbnVtYmVyLCB1c2VVVEM6IGJvb2xlYW4pOiBSZXN1bHQ8RGF0ZVdpdGhOYW5vc2Vjb25kc0RlbHRhPiB7XG4gIGxldCB0aW1lO1xuICAoeyBvZmZzZXQsIHZhbHVlOiB0aW1lIH0gPSByZWFkVGltZShidWYsIG9mZnNldCwgZGF0YUxlbmd0aCAtIDMsIHNjYWxlLCB1c2VVVEMpKTtcblxuICBsZXQgZGF5cztcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogZGF5cyB9ID0gcmVhZFVJbnQyNExFKGJ1Ziwgb2Zmc2V0KSk7XG5cbiAgbGV0IGRhdGU7XG4gIGlmICh1c2VVVEMpIHtcbiAgICBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoMjAwMCwgMCwgZGF5cyAtIDczMDExOCwgMCwgMCwgMCwgK3RpbWUpKSBhcyBEYXRlV2l0aE5hbm9zZWNvbmRzRGVsdGE7XG4gIH0gZWxzZSB7XG4gICAgZGF0ZSA9IG5ldyBEYXRlKDIwMDAsIDAsIGRheXMgLSA3MzAxMTgsIHRpbWUuZ2V0SG91cnMoKSwgdGltZS5nZXRNaW51dGVzKCksIHRpbWUuZ2V0U2Vjb25kcygpLCB0aW1lLmdldE1pbGxpc2Vjb25kcygpKSBhcyBEYXRlV2l0aE5hbm9zZWNvbmRzRGVsdGE7XG4gIH1cbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRhdGUsICduYW5vc2Vjb25kc0RlbHRhJywge1xuICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgIHZhbHVlOiB0aW1lLm5hbm9zZWNvbmRzRGVsdGFcbiAgfSk7XG5cbiAgcmV0dXJuIG5ldyBSZXN1bHQoZGF0ZSwgb2Zmc2V0KTtcbn1cblxuZnVuY3Rpb24gcmVhZERhdGVUaW1lT2Zmc2V0KGJ1ZjogQnVmZmVyLCBvZmZzZXQ6IG51bWJlciwgZGF0YUxlbmd0aDogbnVtYmVyLCBzY2FsZTogbnVtYmVyKTogUmVzdWx0PERhdGVXaXRoTmFub3NlY29uZHNEZWx0YT4ge1xuICBsZXQgdGltZTtcbiAgKHsgb2Zmc2V0LCB2YWx1ZTogdGltZSB9ID0gcmVhZFRpbWUoYnVmLCBvZmZzZXQsIGRhdGFMZW5ndGggLSA1LCBzY2FsZSwgdHJ1ZSkpO1xuXG4gIGxldCBkYXlzO1xuICAoeyBvZmZzZXQsIHZhbHVlOiBkYXlzIH0gPSByZWFkVUludDI0TEUoYnVmLCBvZmZzZXQpKTtcblxuICAvLyB0aW1lIG9mZnNldD9cbiAgKHsgb2Zmc2V0IH0gPSByZWFkVUludDE2TEUoYnVmLCBvZmZzZXQpKTtcblxuICBjb25zdCBkYXRlID0gbmV3IERhdGUoRGF0ZS5VVEMoMjAwMCwgMCwgZGF5cyAtIDczMDExOCwgMCwgMCwgMCwgK3RpbWUpKSBhcyBEYXRlV2l0aE5hbm9zZWNvbmRzRGVsdGE7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShkYXRlLCAnbmFub3NlY29uZHNEZWx0YScsIHtcbiAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICB2YWx1ZTogdGltZS5uYW5vc2Vjb25kc0RlbHRhXG4gIH0pO1xuICByZXR1cm4gbmV3IFJlc3VsdChkYXRlLCBvZmZzZXQpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5yZWFkVmFsdWUgPSByZWFkVmFsdWU7XG5tb2R1bGUuZXhwb3J0cy5pc1BMUFN0cmVhbSA9IGlzUExQU3RyZWFtO1xubW9kdWxlLmV4cG9ydHMucmVhZFBMUFN0cmVhbSA9IHJlYWRQTFBTdHJlYW07XG5cbmV4cG9ydCB7IHJlYWRWYWx1ZSwgaXNQTFBTdHJlYW0sIHJlYWRQTFBTdHJlYW0gfTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFDQSxJQUFBQSxlQUFBLEdBQUFDLE9BQUE7QUFDQSxJ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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/transaction.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Transaction = exports.OPERATION_TYPE = exports.ISOLATION_LEVEL = void 0;
exports.assertValidIsolationLevel = assertValidIsolationLevel;
exports.isolationLevelByValue = void 0;
var _writableTrackingBuffer = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tracking-buffer/writable-tracking-buffer.js [app-route] (ecmascript)"));
var _allHeaders = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/all-headers.js [app-route] (ecmascript)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
/*
  s2.2.6.8
 */ const OPERATION_TYPE = exports.OPERATION_TYPE = {
    TM_GET_DTC_ADDRESS: 0x00,
    TM_PROPAGATE_XACT: 0x01,
    TM_BEGIN_XACT: 0x05,
    TM_PROMOTE_XACT: 0x06,
    TM_COMMIT_XACT: 0x07,
    TM_ROLLBACK_XACT: 0x08,
    TM_SAVE_XACT: 0x09
};
const ISOLATION_LEVEL = exports.ISOLATION_LEVEL = {
    NO_CHANGE: 0x00,
    READ_UNCOMMITTED: 0x01,
    READ_COMMITTED: 0x02,
    REPEATABLE_READ: 0x03,
    SERIALIZABLE: 0x04,
    SNAPSHOT: 0x05
};
const isolationLevelByValue = exports.isolationLevelByValue = {};
for(const name in ISOLATION_LEVEL){
    const value = ISOLATION_LEVEL[name];
    isolationLevelByValue[value] = name;
}
function assertValidIsolationLevel(isolationLevel, name) {
    if (typeof isolationLevel !== 'number') {
        throw new TypeError(`The "${name}" ${name.includes('.') ? 'property' : 'argument'} must be of type number. Received type ${typeof isolationLevel} (${isolationLevel})`);
    }
    if (!Number.isInteger(isolationLevel)) {
        throw new RangeError(`The value of "${name}" is out of range. It must be an integer. Received: ${isolationLevel}`);
    }
    if (!(isolationLevel >= 0 && isolationLevel <= 5)) {
        throw new RangeError(`The value of "${name}" is out of range. It must be >= 0 && <= 5. Received: ${isolationLevel}`);
    }
}
class Transaction {
    constructor(name, isolationLevel = ISOLATION_LEVEL.NO_CHANGE){
        this.name = name;
        this.isolationLevel = isolationLevel;
        this.outstandingRequestCount = 1;
    }
    beginPayload(txnDescriptor) {
        const buffer = new _writableTrackingBuffer.default(100, 'ucs2');
        (0, _allHeaders.writeToTrackingBuffer)(buffer, txnDescriptor, this.outstandingRequestCount);
        buffer.writeUShort(OPERATION_TYPE.TM_BEGIN_XACT);
        buffer.writeUInt8(this.isolationLevel);
        buffer.writeUInt8(this.name.length * 2);
        buffer.writeString(this.name, 'ucs2');
        return {
            *[Symbol.iterator] () {
                yield buffer.data;
            },
            toString: ()=>{
                return 'Begin Transaction: name=' + this.name + ', isolationLevel=' + isolationLevelByValue[this.isolationLevel];
            }
        };
    }
    commitPayload(txnDescriptor) {
        const buffer = new _writableTrackingBuffer.default(100, 'ascii');
        (0, _allHeaders.writeToTrackingBuffer)(buffer, txnDescriptor, this.outstandingRequestCount);
        buffer.writeUShort(OPERATION_TYPE.TM_COMMIT_XACT);
        buffer.writeUInt8(this.name.length * 2);
        buffer.writeString(this.name, 'ucs2');
        // No fBeginXact flag, so no new transaction is started.
        buffer.writeUInt8(0);
        return {
            *[Symbol.iterator] () {
                yield buffer.data;
            },
            toString: ()=>{
                return 'Commit Transaction: name=' + this.name;
            }
        };
    }
    rollbackPayload(txnDescriptor) {
        const buffer = new _writableTrackingBuffer.default(100, 'ascii');
        (0, _allHeaders.writeToTrackingBuffer)(buffer, txnDescriptor, this.outstandingRequestCount);
        buffer.writeUShort(OPERATION_TYPE.TM_ROLLBACK_XACT);
        buffer.writeUInt8(this.name.length * 2);
        buffer.writeString(this.name, 'ucs2');
        // No fBeginXact flag, so no new transaction is started.
        buffer.writeUInt8(0);
        return {
            *[Symbol.iterator] () {
                yield buffer.data;
            },
            toString: ()=>{
                return 'Rollback Transaction: name=' + this.name;
            }
        };
    }
    savePayload(txnDescriptor) {
        const buffer = new _writableTrackingBuffer.default(100, 'ascii');
        (0, _allHeaders.writeToTrackingBuffer)(buffer, txnDescriptor, this.outstandingRequestCount);
        buffer.writeUShort(OPERATION_TYPE.TM_SAVE_XACT);
        buffer.writeUInt8(this.name.length * 2);
        buffer.writeString(this.name, 'ucs2');
        return {
            *[Symbol.iterator] () {
                yield buffer.data;
            },
            toString: ()=>{
                return 'Save Transaction: name=' + this.name;
            }
        };
    }
    isolationLevelToTSQL() {
        switch(this.isolationLevel){
            case ISOLATION_LEVEL.READ_UNCOMMITTED:
                return 'READ UNCOMMITTED';
            case ISOLATION_LEVEL.READ_COMMITTED:
                return 'READ COMMITTED';
            case ISOLATION_LEVEL.REPEATABLE_READ:
                return 'REPEATABLE READ';
            case ISOLATION_LEVEL.SERIALIZABLE:
                return 'SERIALIZABLE';
            case ISOLATION_LEVEL.SNAPSHOT:
                return 'SNAPSHOT';
        }
        return '';
    }
}
exports.Transaction = Transaction; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfd3JpdGFibGVUcmFja2luZ0J1ZmZlciIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2FsbEhlYWRlcnMiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJPUEVSQVRJT05fVFlQRSIsImV4cG9ydHMiLCJUTV9HRVRfRFRDX0FERFJFU1MiLCJUTV9QUk9QQUdBVEVfWEFDVCIsIlRNX0JFR0lOX1hBQ1QiLCJUTV9QUk9NT1RFX1hBQ1QiLCJUTV9DT01NSVRfWEFDVCIsIlRNX1JPTExCQUNLX1hBQ1QiLCJUTV9TQVZFX1hBQ1QiLCJJU09MQVRJT05fTEVWRUwiLCJOT19DSEFOR0UiLCJSRUFEX1VOQ09NTUlUVEVEIiwiUkVBRF9DT01NSVRURUQiLCJSRVBFQVRBQkxFX1JFQUQiLCJTRVJJQUxJWkFCTEUiLCJTTkFQU0hPVCIsImlzb2xhdGlvbkxldmVsQnlWYWx1ZSIsIm5hbWUiLCJ2YWx1ZSIsImFzc2VydFZhbGlkSXNvbGF0aW9uTGV2ZWwiLCJpc29sYXRpb25MZXZlbCIsIlR5cGVFcnJvciIsImluY2x1ZGVzIiwiTnVtYmVyIiwiaXNJbnRlZ2VyIiwiUmFuZ2VFcnJvciIsIlRyYW5zYWN0aW9uIiwiY29uc3RydWN0b3IiLCJvdXRzdGFuZGluZ1JlcXVlc3RDb3VudCIsImJlZ2luUGF5bG9hZCIsInR4bkRlc2NyaXB0b3IiLCJidWZmZXIiLCJXcml0YWJsZVRyYWNraW5nQnVmZmVyIiwid3JpdGVUb1RyYWNraW5nQnVmZmVyIiwid3JpdGVVU2hvcnQiLCJ3cml0ZVVJbnQ4IiwibGVuZ3RoIiwid3JpdGVTdHJpbmciLCJTeW1ib2wiLCJpdGVyYXRvciIsImRhdGEiLCJ0b1N0cmluZyIsImNvbW1pdFBheWxvYWQiLCJyb2xsYmFja1BheWxvYWQiLCJzYXZlUGF5bG9hZCIsImlzb2xhdGlvbkxldmVsVG9UU1FMIl0sInNvdXJjZXMiOlsiLi4vc3JjL3RyYW5zYWN0aW9uLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBXcml0YWJsZVRyYWNraW5nQnVmZmVyIGZyb20gJy4vdHJhY2tpbmctYnVmZmVyL3dyaXRhYmxlLXRyYWNraW5nLWJ1ZmZlcic7XG5pbXBvcnQgeyB3cml0ZVRvVHJhY2tpbmdCdWZmZXIgfSBmcm9tICcuL2FsbC1oZWFkZXJzJztcblxuLypcbiAgczIuMi42LjhcbiAqL1xuXG5leHBvcnQgY29uc3QgT1BFUkFUSU9OX1RZUEUgPSB7XG4gIFRNX0dFVF9EVENfQUREUkVTUzogMHgwMCxcbiAgVE1fUFJPUEFHQVRFX1hBQ1Q6IDB4MDEsXG4gIFRNX0JFR0lOX1hBQ1Q6IDB4MDUsXG4gIFRNX1BST01PVEVfWEFDVDogMHgwNixcbiAgVE1fQ09NTUlUX1hBQ1Q6IDB4MDcsXG4gIFRNX1JPTExCQUNLX1hBQ1Q6IDB4MDgsXG4gIFRNX1NBVkVfWEFDVDogMHgwOVxufTtcblxuZXhwb3J0IGNvbnN0IElTT0xBVElPTl9MRVZFTDogeyBba2V5OiBzdHJpbmddOiBudW1iZXIgfSA9IHtcbiAgTk9fQ0hBTkdFOiAweDAwLFxuICBSRUFEX1VOQ09NTUlUVEVEOiAweDAxLFxuICBSRUFEX0NPTU1JVFRFRDogMHgwMixcbiAgUkVQRUFUQUJMRV9SRUFEOiAweDAzLFxuICBTRVJJQUxJWkFCTEU6IDB4MDQsXG4gIFNOQVBTSE9UOiAweDA1XG59O1xuXG5leHBvcnQgY29uc3QgaXNvbGF0aW9uTGV2ZWxCeVZhbHVlOiB7IFtrZXk6IG51bWJlcl06IHN0cmluZyB9ID0ge307XG5mb3IgKGNvbnN0IG5hbWUgaW4gSVNPTEFUSU9OX0xFVkVMKSB7XG4gIGNvbnN0IHZhbHVlID0gSVNPTEFUSU9OX0xFVkVMW25hbWVdO1xuICBpc29sYXRpb25MZXZlbEJ5VmFsdWVbdmFsdWVdID0gbmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydFZhbGlkSXNvbGF0aW9uTGV2ZWwoaXNvbGF0aW9uTGV2ZWw6IGFueSwgbmFtZTogc3RyaW5nKTogYXNzZXJ0cyBpc29sYXRpb25MZXZlbCBpcyAwIHwgMSB8IDIgfCAzIHwgNCB8IDUge1xuICBpZiAodHlwZW9mIGlzb2xhdGlvbkxldmVsICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYFRoZSBcIiR7bmFtZX1cIiAke25hbWUuaW5jbHVkZXMoJy4nKSA/ICdwcm9wZXJ0eScgOiAnYXJndW1lbnQnfSBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlICR7dHlwZW9mIGlzb2xhdGlvbkxldmVsfSAoJHtpc29sYXRpb25MZXZlbH0pYCk7XG4gIH1cblxuICBpZiAoIU51bWJlci5pc0ludGVnZXIoaXNvbGF0aW9uTGV2ZWwpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYFRoZSB2YWx1ZSBvZiBcIiR7bmFtZX1cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYW4gaW50ZWdlci4gUmVjZWl2ZWQ6ICR7aXNvbGF0aW9uTGV2ZWx9YCk7XG4gIH1cblxuICBpZiAoIShpc29sYXRpb25MZXZlbCA+PSAwICYmIGlzb2xhdGlvbkxldmVsIDw9IDUpKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYFRoZSB2YWx1ZSBvZiBcIiR7bmFtZX1cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgPj0gMCAmJiA8PSA1LiBSZWNlaXZlZDogJHtpc29sYXRpb25MZXZlbH1gKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgVHJhbnNhY3Rpb24ge1xuICBkZWNsYXJlIG5hbWU6IHN0cmluZztcbiAgZGVjbGFyZSBpc29sYXRpb25MZXZlbDogbnVtYmVyO1xuICBkZWNsYXJlIG91dHN0YW5kaW5nUmVxdWVzdENvdW50OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCBpc29sYXRpb25MZXZlbCA9IElTT0xBVElPTl9MRVZFTC5OT19DSEFOR0UpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaXNvbGF0aW9uTGV2ZWwgPSBpc29sYXRpb25MZXZlbDtcbiAgICB0aGlzLm91dHN0YW5kaW5nUmVxdWVzdENvdW50ID0gMTtcbiAgfVxuXG4gIGJlZ2luUGF5bG9hZCh0eG5EZXNjcmlwdG9yOiBCdWZmZXIpIHtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgV3JpdGFibGVUcmFja2luZ0J1ZmZlcigxMDAsICd1Y3MyJyk7XG4gICAgd3JpdGVUb1RyYWNraW5nQnVmZmVyKGJ1ZmZlciwgdHhuRGVzY3JpcHRvciwgdGhpcy5vdXRzdGFuZGluZ1JlcXVlc3RDb3VudCk7XG4gICAgYnVmZmVyLndyaXRlVVNob3J0KE9QRVJBVElPTl9UWVBFLlRNX0JFR0lOX1hBQ1QpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KHRoaXMuaXNvbGF0aW9uTGV2ZWwpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KHRoaXMubmFtZS5sZW5ndGggKiAyKTtcbiAgICBidWZmZXIud3JpdGVTdHJpbmcodGhpcy5uYW1lLCAndWNzMicpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgeWllbGQgYnVmZmVyLmRhdGE7XG4gICAgICB9LFxuICAgICAgdG9TdHJpbmc6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuICdCZWdpbiBUcmFuc2FjdGlvbjogbmFtZT0nICsgdGhpcy5uYW1lICsgJywgaXNvbGF0aW9uTGV2ZWw9JyArIGlzb2xhdGlvbkxldmVsQnlWYWx1ZVt0aGlzLmlzb2xhdGlvbkxldmVsXTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgY29tbWl0UGF5bG9hZCh0eG5EZXNjcmlwdG9yOiBCdWZmZXIpIHtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgV3JpdGFibGVUcmFja2luZ0J1ZmZlcigxMDAsICdhc2NpaScpO1xuICAgIHdyaXRlVG9UcmFja2luZ0J1ZmZlcihidWZmZXIsIHR4bkRlc2NyaXB0b3IsIHRoaXMub3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQpO1xuICAgIGJ1ZmZlci53cml0ZVVTaG9ydChPUEVSQVRJT05fVFlQRS5UTV9DT01NSVRfWEFDVCk7XG4gICAgYnVmZmVyLndyaXRlVUludDgodGhpcy5uYW1lLmxlbmd0aCAqIDIpO1xuICAgIGJ1ZmZlci53cml0ZVN0cmluZyh0aGlzLm5hbWUsICd1Y3MyJyk7XG4gICAgLy8gTm8gZkJlZ2luWGFjdCBmbGFnLCBzbyBubyBuZXcgdHJhbnNhY3Rpb24gaXMgc3RhcnRlZC5cbiAgICBidWZmZXIud3JpdGVVSW50OCgwKTtcblxuICAgIHJldHVybiB7XG4gICAgICAqW1N5bWJvbC5pdGVyYXRvcl0oKSB7XG4gICAgICAgIHlpZWxkIGJ1ZmZlci5kYXRhO1xuICAgICAgfSxcbiAgICAgIHRvU3RyaW5nOiAoKSA9PiB7XG4gICAgICAgIHJldHVybiAnQ29tbWl0IFRyYW5zYWN0aW9uOiBuYW1lPScgKyB0aGlzLm5hbWU7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJvbGxiYWNrUGF5bG9hZCh0eG5EZXNjcmlwdG9yOiBCdWZmZXIpIHtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgV3JpdGFibGVUcmFja2luZ0J1ZmZlcigxMDAsICdhc2NpaScpO1xuICAgIHdyaXRlVG9UcmFja2luZ0J1ZmZlcihidWZmZXIsIHR4bkRlc2NyaXB0b3IsIHRoaXMub3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQpO1xuICAgIGJ1ZmZlci53cml0ZVVTaG9ydChPUEVSQVRJT05fVFlQRS5UTV9ST0xMQkFDS19YQUNUKTtcbiAgICBidWZmZXIud3JpdGVVSW50OCh0aGlzLm5hbWUubGVuZ3RoICogMik7XG4gICAgYnVmZmVyLndyaXRlU3RyaW5nKHRoaXMubmFtZSwgJ3VjczInKTtcbiAgICAvLyBObyBmQmVnaW5YYWN0IGZsYWcsIHNvIG5vIG5ldyB0cmFuc2FjdGlvbiBpcyBzdGFydGVkLlxuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KDApO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgeWllbGQgYnVmZmVyLmRhdGE7XG4gICAgICB9LFxuICAgICAgdG9TdHJpbmc6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuICdSb2xsYmFjayBUcmFuc2FjdGlvbjogbmFtZT0nICsgdGhpcy5uYW1lO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBzYXZlUGF5bG9hZCh0eG5EZXNjcmlwdG9yOiBCdWZmZXIpIHtcbiAgICBjb25zdCBidWZmZXIgPSBuZXcgV3JpdGFibGVUcmFja2luZ0J1ZmZlcigxMDAsICdhc2NpaScpO1xuICAgIHdyaXRlVG9UcmFja2luZ0J1ZmZlcihidWZmZXIsIHR4bkRlc2NyaXB0b3IsIHRoaXMub3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQpO1xuICAgIGJ1ZmZlci53cml0ZVVTaG9ydChPUEVSQVRJT05fVFlQRS5UTV9TQVZFX1hBQ1QpO1xuICAgIGJ1ZmZlci53cml0ZVVJbnQ4KHRoaXMubmFtZS5sZW5ndGggKiAyKTtcbiAgICBidWZmZXIud3JpdGVTdHJpbmcodGhpcy5uYW1lLCAndWNzMicpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICpbU3ltYm9sLml0ZXJhdG9yXSgpIHtcbiAgICAgICAgeWllbGQgYnVmZmVyLmRhdGE7XG4gICAgICB9LFxuICAgICAgdG9TdHJpbmc6ICgpID0+IHtcbiAgICAgICAgcmV0dXJuICdTYXZlIFRyYW5zYWN0aW9uOiBuYW1lPScgKyB0aGlzLm5hbWU7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIGlzb2xhdGlvbkxldmVsVG9UU1FMKCkge1xuICAgIHN3aXRjaCAodGhpcy5pc29sYXRpb25MZXZlbCkge1xuICAgICAgY2FzZSBJU09MQVRJT05fTEVWRUwuUkVBRF9VTkNPTU1JVFRFRDpcbiAgICAgICAgcmV0dXJuICdSRUFEIFVOQ09NTUlUVEVEJztcbiAgICAgIGNhc2UgSVNPTEFUSU9OX0xFVkVMLlJFQURfQ09NTUlUVEVEOlxuICAgICAgICByZXR1cm4gJ1JFQUQgQ09NTUlUVEVEJztcbiAgICAgIGNhc2UgSVNPTEFUSU9OX0xFVkVMLlJFUEVBVEFCTEVfUkVBRDpcbiAgICAgICAgcmV0dXJuICdSRVBFQVRBQkxFIFJFQUQnO1xuICAgICAgY2FzZSBJU09MQVRJT05fTEVWRUwuU0VSSUFMSVpBQkxFOlxuICAgICAgICByZXR1cm4gJ1NFUklBTElaQUJMRSc7XG4gICAgICBjYXNlIElTT0xBVElPTl9MRVZFTC5TTkFQU0hPVDpcbiAgICAgICAgcmV0dXJuICdTTkFQU0hPVCc7XG4gICAgfVxuICAgIHJldHVybiAnJztcbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLElBQUFBLHVCQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxXQUFBLEdBQUFELE9BQUE7QUFBc0QsU0FBQUQsdUJBQUFHLENBQUEsV0FBQUEsQ0FBQSxJQUFBQSxDQUFBLENBQUFDLFVBQUEsR0FBQUQsQ0FBQSxLQUFBRSxPQUFBLEVBQUFGLENBQUE7QUFFdEQ7QUFDQTtBQUNBOztBQUVPLE1BQU1HLGNBQWMsR0FBQUMsT0FBQSxDQUFBRCxjQUFBLEdBQUc7RUFDNUJFLGtCQUFrQixFQUFFLElBQUk7RUFDeEJDLGlCQUFpQixFQUFFLElBQUk7RUFDdkJDLGFBQWEsRUFBRSxJQUFJO0VBQ25CQyxlQUFlLEVBQUUsSUFBSTtFQUNyQkMsY0FBYyxFQUFFLElBQUk7RUFDcEJDLGdCQUFnQixFQUFFLElBQUk7RUFDdEJDLFlBQVksRUFBRTtBQUNoQixDQUFDO0FBRU0sTUFBTUMsZUFBMEMsR0FBQVIsT0FBQSxDQUFBUSxlQUFBLEdBQUc7RUFDeERDLFNBQVMsRUFBRSxJQUFJO0VBQ2ZDLGdCQUFnQixFQUFFLElBQUk7RUFDdEJDLGNBQWMsRUFBRSxJQUFJO0VBQ3BCQyxlQUFlLEVBQUUsSUFBSTtFQUNyQkMsWUFBWSxFQUFFLElBQUk7RUFDbEJDLFFBQVEsRUFBRTtBQUNaLENBQUM7QUFFTSxNQUFNQyxxQkFBZ0QsR0FBQWYsT0FBQSxDQUFBZSxxQkFBQSxHQUFHLENBQUMsQ0FBQztBQUNsRSxLQUFLLE1BQU1DLElBQUksSUFBSVIsZUFBZSxFQUFFO0VBQ2xDLE1BQU1TLEtBQUssR0FBR1QsZUFBZSxDQUFDUSxJQUFJLENBQUM7RUFDbkNELHFCQUFxQixDQUFD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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/connector.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.connectInParallel = connectInParallel;
exports.connectInSequence = connectInSequence;
exports.lookupAllAddresses = lookupAllAddresses;
var _net = _interopRequireDefault(__turbopack_context__.r("[externals]/net [external] (net, cjs)"));
var _nodeUrl = _interopRequireDefault(__turbopack_context__.r("[externals]/node:url [external] (node:url, cjs)"));
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
async function connectInParallel(options, lookup, signal) {
    signal.throwIfAborted();
    const addresses = await lookupAllAddresses(options.host, lookup, signal);
    return await new Promise((resolve, reject)=>{
        const sockets = new Array(addresses.length);
        const errors = [];
        function onError(err) {
            errors.push(err);
            this.removeListener('error', onError);
            this.removeListener('connect', onConnect);
            this.destroy();
            if (errors.length === addresses.length) {
                signal.removeEventListener('abort', onAbort);
                reject(new AggregateError(errors, 'Could not connect (parallel)'));
            }
        }
        function onConnect() {
            signal.removeEventListener('abort', onAbort);
            for(let j = 0; j < sockets.length; j++){
                const socket = sockets[j];
                if (this === socket) {
                    continue;
                }
                socket.removeListener('error', onError);
                socket.removeListener('connect', onConnect);
                socket.destroy();
            }
            resolve(this);
        }
        const onAbort = ()=>{
            for(let j = 0; j < sockets.length; j++){
                const socket = sockets[j];
                socket.removeListener('error', onError);
                socket.removeListener('connect', onConnect);
                socket.destroy();
            }
            reject(signal.reason);
        };
        for(let i = 0, len = addresses.length; i < len; i++){
            const socket = sockets[i] = _net.default.connect({
                ...options,
                host: addresses[i].address,
                family: addresses[i].family
            });
            socket.on('error', onError);
            socket.on('connect', onConnect);
        }
        signal.addEventListener('abort', onAbort, {
            once: true
        });
    });
}
async function connectInSequence(options, lookup, signal) {
    signal.throwIfAborted();
    const errors = [];
    const addresses = await lookupAllAddresses(options.host, lookup, signal);
    for (const address of addresses){
        try {
            return await new Promise((resolve, reject)=>{
                const socket = _net.default.connect({
                    ...options,
                    host: address.address,
                    family: address.family
                });
                const onAbort = ()=>{
                    socket.removeListener('error', onError);
                    socket.removeListener('connect', onConnect);
                    socket.destroy();
                    reject(signal.reason);
                };
                const onError = (err)=>{
                    signal.removeEventListener('abort', onAbort);
                    socket.removeListener('error', onError);
                    socket.removeListener('connect', onConnect);
                    socket.destroy();
                    reject(err);
                };
                const onConnect = ()=>{
                    signal.removeEventListener('abort', onAbort);
                    socket.removeListener('error', onError);
                    socket.removeListener('connect', onConnect);
                    resolve(socket);
                };
                signal.addEventListener('abort', onAbort, {
                    once: true
                });
                socket.on('error', onError);
                socket.on('connect', onConnect);
            });
        } catch (err) {
            // If the signal was aborted, re-throw the error.
            signal.throwIfAborted();
            errors.push(err);
            continue;
        }
    }
    throw new AggregateError(errors, 'Could not connect (sequence)');
}
/**
 * Look up all addresses for the given hostname.
 */ async function lookupAllAddresses(host, lookup, signal) {
    signal.throwIfAborted();
    if (_net.default.isIPv6(host)) {
        return [
            {
                address: host,
                family: 6
            }
        ];
    } else if (_net.default.isIPv4(host)) {
        return [
            {
                address: host,
                family: 4
            }
        ];
    } else {
        return await new Promise((resolve, reject)=>{
            const onAbort = ()=>{
                reject(signal.reason);
            };
            signal.addEventListener('abort', onAbort);
            const domainInASCII = _nodeUrl.default.domainToASCII(host);
            lookup(domainInASCII === '' ? host : domainInASCII, {
                all: true
            }, (err, addresses)=>{
                signal.removeEventListener('abort', onAbort);
                err ? reject(err) : resolve(addresses);
            });
        });
    }
} //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfbmV0IiwiX2ludGVyb3BSZXF1aXJlRGVmYXVsdCIsInJlcXVpcmUiLCJfbm9kZVVybCIsImUiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImNvbm5lY3RJblBhcmFsbGVsIiwib3B0aW9ucyIsImxvb2t1cCIsInNpZ25hbCIsInRocm93SWZBYm9ydGVkIiwiYWRkcmVzc2VzIiwibG9va3VwQWxsQWRkcmVzc2VzIiwiaG9zdCIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0Iiwic29ja2V0cyIsIkFycmF5IiwibGVuZ3RoIiwiZXJyb3JzIiwib25FcnJvciIsImVyciIsInB1c2giLCJyZW1vdmVMaXN0ZW5lciIsIm9uQ29ubmVjdCIsImRlc3Ryb3kiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwib25BYm9ydCIsIkFnZ3JlZ2F0ZUVycm9yIiwiaiIsInNvY2tldCIsInJlYXNvbiIsImkiLCJsZW4iLCJuZXQiLCJjb25uZWN0IiwiYWRkcmVzcyIsImZhbWlseSIsIm9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsIm9uY2UiLCJjb25uZWN0SW5TZXF1ZW5jZSIsImlzSVB2NiIsImlzSVB2NCIsImRvbWFpbkluQVNDSUkiLCJ1cmwiLCJkb21haW5Ub0FTQ0lJIiwiYWxsIl0sInNvdXJjZXMiOlsiLi4vc3JjL2Nvbm5lY3Rvci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbmV0IGZyb20gJ25ldCc7XG5pbXBvcnQgZG5zLCB7IHR5cGUgTG9va3VwQWRkcmVzcyB9IGZyb20gJ2Rucyc7XG5cbmltcG9ydCB1cmwgZnJvbSAnbm9kZTp1cmwnO1xuXG50eXBlIExvb2t1cEZ1bmN0aW9uID0gKGhvc3RuYW1lOiBzdHJpbmcsIG9wdGlvbnM6IGRucy5Mb29rdXBBbGxPcHRpb25zLCBjYWxsYmFjazogKGVycjogTm9kZUpTLkVycm5vRXhjZXB0aW9uIHwgbnVsbCwgYWRkcmVzc2VzOiBkbnMuTG9va3VwQWRkcmVzc1tdKSA9PiB2b2lkKSA9PiB2b2lkO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29ubmVjdEluUGFyYWxsZWwob3B0aW9uczogeyBob3N0OiBzdHJpbmcsIHBvcnQ6IG51bWJlciwgbG9jYWxBZGRyZXNzPzogc3RyaW5nIHwgdW5kZWZpbmVkIH0sIGxvb2t1cDogTG9va3VwRnVuY3Rpb24sIHNpZ25hbDogQWJvcnRTaWduYWwpIHtcbiAgc2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG5cbiAgY29uc3QgYWRkcmVzc2VzID0gYXdhaXQgbG9va3VwQWxsQWRkcmVzc2VzKG9wdGlvbnMuaG9zdCwgbG9va3VwLCBzaWduYWwpO1xuXG4gIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZTxuZXQuU29ja2V0PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgc29ja2V0cyA9IG5ldyBBcnJheShhZGRyZXNzZXMubGVuZ3RoKTtcblxuICAgIGNvbnN0IGVycm9yczogRXJyb3JbXSA9IFtdO1xuXG4gICAgZnVuY3Rpb24gb25FcnJvcih0aGlzOiBuZXQuU29ja2V0LCBlcnI6IEVycm9yKSB7XG4gICAgICBlcnJvcnMucHVzaChlcnIpO1xuXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uQ29ubmVjdCk7XG5cbiAgICAgIHRoaXMuZGVzdHJveSgpO1xuXG4gICAgICBpZiAoZXJyb3JzLmxlbmd0aCA9PT0gYWRkcmVzc2VzLmxlbmd0aCkge1xuICAgICAgICBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0KTtcblxuICAgICAgICByZWplY3QobmV3IEFnZ3JlZ2F0ZUVycm9yKGVycm9ycywgJ0NvdWxkIG5vdCBjb25uZWN0IChwYXJhbGxlbCknKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25Db25uZWN0KHRoaXM6IG5ldC5Tb2NrZXQpIHtcbiAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNvY2tldHMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgY29uc3Qgc29ja2V0ID0gc29ja2V0c1tqXTtcblxuICAgICAgICBpZiAodGhpcyA9PT0gc29ja2V0KSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cblxuICAgICAgICBzb2NrZXQucmVtb3ZlTGlzdGVuZXIoJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uQ29ubmVjdCk7XG4gICAgICAgIHNvY2tldC5kZXN0cm95KCk7XG4gICAgICB9XG5cbiAgICAgIHJlc29sdmUodGhpcyk7XG4gICAgfVxuXG4gICAgY29uc3Qgb25BYm9ydCA9ICgpID0+IHtcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgc29ja2V0cy5sZW5ndGg7IGorKykge1xuICAgICAgICBjb25zdCBzb2NrZXQgPSBzb2NrZXRzW2pdO1xuXG4gICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdjb25uZWN0Jywgb25Db25uZWN0KTtcblxuICAgICAgICBzb2NrZXQuZGVzdHJveSgpO1xuICAgICAgfVxuXG4gICAgICByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgfTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBhZGRyZXNzZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IHNvY2tldCA9IHNvY2tldHNbaV0gPSBuZXQuY29ubmVjdCh7XG4gICAgICAgIC4uLm9wdGlvbnMsXG4gICAgICAgIGhvc3Q6IGFkZHJlc3Nlc1tpXS5hZGRyZXNzLFxuICAgICAgICBmYW1pbHk6IGFkZHJlc3Nlc1tpXS5mYW1pbHlcbiAgICAgIH0pO1xuXG4gICAgICBzb2NrZXQub24oJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICBzb2NrZXQub24oJ2Nvbm5lY3QnLCBvbkNvbm5lY3QpO1xuICAgIH1cblxuICAgIHNpZ25hbC5hZGRFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0SW5TZXF1ZW5jZShvcHRpb25zOiB7IGhvc3Q6IHN0cmluZywgcG9ydDogbnVtYmVyLCBsb2NhbEFkZHJlc3M/OiBzdHJpbmcgfCB1bmRlZmluZWQgfSwgbG9va3VwOiBMb29rdXBGdW5jdGlvbiwgc2lnbmFsOiBBYm9ydFNpZ25hbCkge1xuICBzaWduYWwudGhyb3dJZkFib3J0ZWQoKTtcblxuICBjb25zdCBlcnJvcnM6IGFueVtdID0gW107XG4gIGNvbnN0IGFkZHJlc3NlcyA9IGF3YWl0IGxvb2t1cEFsbEFkZHJlc3NlcyhvcHRpb25zLmhvc3QsIGxvb2t1cCwgc2lnbmFsKTtcblxuICBmb3IgKGNvbnN0IGFkZHJlc3Mgb2YgYWRkcmVzc2VzKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBhd2FpdCBuZXcgUHJvbWlzZTxuZXQuU29ja2V0PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHNvY2tldCA9IG5ldC5jb25uZWN0KHtcbiAgICAgICAgICAuLi5vcHRpb25zLFxuICAgICAgICAgIGhvc3Q6IGFkZHJlc3MuYWRkcmVzcyxcbiAgICAgICAgICBmYW1pbHk6IGFkZHJlc3MuZmFtaWx5XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbnN0IG9uQWJvcnQgPSAoKSA9PiB7XG4gICAgICAgICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uQ29ubmVjdCk7XG5cbiAgICAgICAgICBzb2NrZXQuZGVzdHJveSgpO1xuXG4gICAgICAgICAgcmVqZWN0KHNpZ25hbC5yZWFzb24pO1xuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnN0IG9uRXJyb3IgPSAoZXJyOiBFcnJvcikgPT4ge1xuICAgICAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuXG4gICAgICAgICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uQ29ubmVjdCk7XG5cbiAgICAgICAgICBzb2NrZXQuZGVzdHJveSgpO1xuXG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb25Db25uZWN0ID0gKCkgPT4ge1xuICAgICAgICAgIHNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG9uQWJvcnQpO1xuXG4gICAgICAgICAgc29ja2V0LnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgICAgICAgIHNvY2tldC5yZW1vdmVMaXN0ZW5lcignY29ubmVjdCcsIG9uQ29ubmVjdCk7XG5cbiAgICAgICAgICByZXNvbHZlKHNvY2tldCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgc2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb25BYm9ydCwgeyBvbmNlOiB0cnVlIH0pO1xuXG4gICAgICAgIHNvY2tldC5vbignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgICAgc29ja2V0Lm9uKCdjb25uZWN0Jywgb25Db25uZWN0KTtcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgLy8gSWYgdGhlIHNpZ25hbCB3YXMgYWJvcnRlZCwgcmUtdGhyb3cgdGhlIGVycm9yLlxuICAgICAgc2lnbmFsLnRocm93SWZBYm9ydGVkKCk7XG5cbiAgICAgIGVycm9ycy5wdXNoKGVycik7XG5cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgfVxuXG4gIHRocm93IG5ldyBBZ2dyZWdhdGVFcnJvcihlcnJvcnMsICdDb3VsZCBub3QgY29ubmVjdCAoc2VxdWVuY2UpJyk7XG59XG5cbi8qKlxuICogTG9vayB1cCBhbGwgYWRkcmVzc2VzIGZvciB0aGUgZ2l2ZW4gaG9zdG5hbWUuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb29rdXBBbGxBZGRyZXNzZXMoaG9zdDogc3RyaW5nLCBsb29rdXA6IExvb2t1cEZ1bmN0aW9uLCBzaWduYWw6IEFib3J0U2lnbmFsKTogUHJvbWlzZTxkbnMuTG9va3VwQWRkcmVzc1tdPiB7XG4gIHNpZ25hbC50aHJvd0lmQWJvcnRlZCgpO1xuXG4gIGlmIChuZXQuaXNJUHY2KGhvc3QpKSB7XG4gICAgcmV0dXJuIFt7IGFkZHJlc3M6IGhvc3QsIGZhbWlseTogNiB9XTtcbiAgfSBlbHNlIGlmIChuZXQuaXNJUHY0KGhvc3QpKSB7XG4gICAgcmV0dXJuIFt7IGFkZHJlc3M6IGhvc3QsIGZhbWlseTogNCB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2U8TG9va3VwQWRkcmVzc1tdPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBjb25zdCBvbkFib3J0ID0gKCkgPT4ge1xuICAgICAgICByZWplY3Qoc2lnbmFsLnJlYXNvbik7XG4gICAgICB9O1xuXG4gICAgICBzaWduYWwuYWRkRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0KTtcblxuICAgICAgY29uc3QgZG9tYWluSW5BU0NJSSA9IHVybC5kb21haW5Ub0FTQ0lJKGhvc3QpO1xuICAgICAgbG9va3VwKGRvbWFpbkluQVNDSUkgPT09ICcnID8gaG9zdCA6IGRvbWFpbkluQVNDSUksIHsgYWxsOiB0cnVlIH0sIChlcnIsIGFkZHJlc3NlcykgPT4ge1xuICAgICAgICBzaWduYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignYWJvcnQnLCBvbkFib3J0KTtcblxuICAgICAgICBlcnIgPyByZWplY3QoZXJyKSA6IHJlc29sdmUoYWRkcmVzc2VzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xu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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/library.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.name = void 0;
const name = exports.name = 'Tedious'; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJuYW1lIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi4uL3NyYy9saWJyYXJ5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjb25zdCBuYW1lID0gJ1RlZGlvdXMnO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBTyxNQUFNQSxJQUFJLEdBQUFDLE9BQUEsQ0FBQUQsSUFBQSxHQUFHLFNBQVMiLCJpZ25vcmVMaXN0IjpbXX0=
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/ntlm.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createNTLMRequest = createNTLMRequest;
const NTLMFlags = {
    NTLM_NegotiateUnicode: 0x00000001,
    NTLM_NegotiateOEM: 0x00000002,
    NTLM_RequestTarget: 0x00000004,
    NTLM_Unknown9: 0x00000008,
    NTLM_NegotiateSign: 0x00000010,
    NTLM_NegotiateSeal: 0x00000020,
    NTLM_NegotiateDatagram: 0x00000040,
    NTLM_NegotiateLanManagerKey: 0x00000080,
    NTLM_Unknown8: 0x00000100,
    NTLM_NegotiateNTLM: 0x00000200,
    NTLM_NegotiateNTOnly: 0x00000400,
    NTLM_Anonymous: 0x00000800,
    NTLM_NegotiateOemDomainSupplied: 0x00001000,
    NTLM_NegotiateOemWorkstationSupplied: 0x00002000,
    NTLM_Unknown6: 0x00004000,
    NTLM_NegotiateAlwaysSign: 0x00008000,
    NTLM_TargetTypeDomain: 0x00010000,
    NTLM_TargetTypeServer: 0x00020000,
    NTLM_TargetTypeShare: 0x00040000,
    NTLM_NegotiateExtendedSecurity: 0x00080000,
    NTLM_NegotiateIdentify: 0x00100000,
    NTLM_Unknown5: 0x00200000,
    NTLM_RequestNonNTSessionKey: 0x00400000,
    NTLM_NegotiateTargetInfo: 0x00800000,
    NTLM_Unknown4: 0x01000000,
    NTLM_NegotiateVersion: 0x02000000,
    NTLM_Unknown3: 0x04000000,
    NTLM_Unknown2: 0x08000000,
    NTLM_Unknown1: 0x10000000,
    NTLM_Negotiate128: 0x20000000,
    NTLM_NegotiateKeyExchange: 0x40000000,
    NTLM_Negotiate56: 0x80000000
};
function createNTLMRequest(options) {
    const domain = escape(options.domain.toUpperCase());
    const workstation = options.workstation ? escape(options.workstation.toUpperCase()) : '';
    let type1flags = NTLMFlags.NTLM_NegotiateUnicode + NTLMFlags.NTLM_NegotiateOEM + NTLMFlags.NTLM_RequestTarget + NTLMFlags.NTLM_NegotiateNTLM + NTLMFlags.NTLM_NegotiateOemDomainSupplied + NTLMFlags.NTLM_NegotiateOemWorkstationSupplied + NTLMFlags.NTLM_NegotiateAlwaysSign + NTLMFlags.NTLM_NegotiateVersion + NTLMFlags.NTLM_NegotiateExtendedSecurity + NTLMFlags.NTLM_Negotiate128 + NTLMFlags.NTLM_Negotiate56;
    if (workstation === '') {
        type1flags -= NTLMFlags.NTLM_NegotiateOemWorkstationSupplied;
    }
    const fixedData = Buffer.alloc(40);
    const buffers = [
        fixedData
    ];
    let offset = 0;
    offset += fixedData.write('NTLMSSP', offset, 7, 'ascii');
    offset = fixedData.writeUInt8(0, offset);
    offset = fixedData.writeUInt32LE(1, offset);
    offset = fixedData.writeUInt32LE(type1flags, offset);
    offset = fixedData.writeUInt16LE(domain.length, offset);
    offset = fixedData.writeUInt16LE(domain.length, offset);
    offset = fixedData.writeUInt32LE(fixedData.length + workstation.length, offset);
    offset = fixedData.writeUInt16LE(workstation.length, offset);
    offset = fixedData.writeUInt16LE(workstation.length, offset);
    offset = fixedData.writeUInt32LE(fixedData.length, offset);
    offset = fixedData.writeUInt8(5, offset);
    offset = fixedData.writeUInt8(0, offset);
    offset = fixedData.writeUInt16LE(2195, offset);
    offset = fixedData.writeUInt8(0, offset);
    offset = fixedData.writeUInt8(0, offset);
    offset = fixedData.writeUInt8(0, offset);
    fixedData.writeUInt8(15, offset);
    buffers.push(Buffer.from(workstation, 'ascii'));
    buffers.push(Buffer.from(domain, 'ascii'));
    return Buffer.concat(buffers);
} //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJOVExNRmxhZ3MiLCJOVExNX05lZ290aWF0ZVVuaWNvZGUiLCJOVExNX05lZ290aWF0ZU9FTSIsIk5UTE1fUmVxdWVzdFRhcmdldCIsIk5UTE1fVW5rbm93bjkiLCJOVExNX05lZ290aWF0ZVNpZ24iLCJOVExNX05lZ290aWF0ZVNlYWwiLCJOVExNX05lZ290aWF0ZURhdGFncmFtIiwiTlRMTV9OZWdvdGlhdGVMYW5NYW5hZ2VyS2V5IiwiTlRMTV9Vbmtub3duOCIsIk5UTE1fTmVnb3RpYXRlTlRMTSIsIk5UTE1fTmVnb3RpYXRlTlRPbmx5IiwiTlRMTV9Bbm9ueW1vdXMiLCJOVExNX05lZ290aWF0ZU9lbURvbWFpblN1cHBsaWVkIiwiTlRMTV9OZWdvdGlhdGVPZW1Xb3Jrc3RhdGlvblN1cHBsaWVkIiwiTlRMTV9Vbmtub3duNiIsIk5UTE1fTmVnb3RpYXRlQWx3YXlzU2lnbiIsIk5UTE1fVGFyZ2V0VHlwZURvbWFpbiIsIk5UTE1fVGFyZ2V0VHlwZVNlcnZlciIsIk5UTE1fVGFyZ2V0VHlwZVNoYXJlIiwiTlRMTV9OZWdvdGlhdGVFeHRlbmRlZFNlY3VyaXR5IiwiTlRMTV9OZWdvdGlhdGVJZGVudGlmeSIsIk5UTE1fVW5rbm93bjUiLCJOVExNX1JlcXVlc3ROb25OVFNlc3Npb25LZXkiLCJOVExNX05lZ290aWF0ZVRhcmdldEluZm8iLCJOVExNX1Vua25vd240IiwiTlRMTV9OZWdvdGlhdGVWZXJzaW9uIiwiTlRMTV9Vbmtub3duMyIsIk5UTE1fVW5rbm93bjIiLCJOVExNX1Vua25vd24xIiwiTlRMTV9OZWdvdGlhdGUxMjgiLCJOVExNX05lZ290aWF0ZUtleUV4Y2hhbmdlIiwiTlRMTV9OZWdvdGlhdGU1NiIsImNyZWF0ZU5UTE1SZXF1ZXN0Iiwib3B0aW9ucyIsImRvbWFpbiIsImVzY2FwZSIsInRvVXBwZXJDYXNlIiwid29ya3N0YXRpb24iLCJ0eXBlMWZsYWdzIiwiZml4ZWREYXRhIiwiQnVmZmVyIiwiYWxsb2MiLCJidWZmZXJzIiwib2Zmc2V0Iiwid3JpdGUiLCJ3cml0ZVVJbnQ4Iiwid3JpdGVVSW50MzJMRSIsIndyaXRlVUludDE2TEUiLCJsZW5ndGgiLCJwdXNoIiwiZnJvbSIsImNvbmNhdCJdLCJzb3VyY2VzIjpbIi4uL3NyYy9udGxtLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE5UTE1GbGFncyA9IHtcbiAgTlRMTV9OZWdvdGlhdGVVbmljb2RlOiAweDAwMDAwMDAxLFxuICBOVExNX05lZ290aWF0ZU9FTTogMHgwMDAwMDAwMixcbiAgTlRMTV9SZXF1ZXN0VGFyZ2V0OiAweDAwMDAwMDA0LFxuICBOVExNX1Vua25vd245OiAweDAwMDAwMDA4LFxuICBOVExNX05lZ290aWF0ZVNpZ246IDB4MDAwMDAwMTAsXG4gIE5UTE1fTmVnb3RpYXRlU2VhbDogMHgwMDAwMDAyMCxcbiAgTlRMTV9OZWdvdGlhdGVEYXRhZ3JhbTogMHgwMDAwMDA0MCxcbiAgTlRMTV9OZWdvdGlhdGVMYW5NYW5hZ2VyS2V5OiAweDAwMDAwMDgwLFxuICBOVExNX1Vua25vd244OiAweDAwMDAwMTAwLFxuICBOVExNX05lZ290aWF0ZU5UTE06IDB4MDAwMDAyMDAsXG4gIE5UTE1fTmVnb3RpYXRlTlRPbmx5OiAweDAwMDAwNDAwLFxuICBOVExNX0Fub255bW91czogMHgwMDAwMDgwMCxcbiAgTlRMTV9OZWdvdGlhdGVPZW1Eb21haW5TdXBwbGllZDogMHgwMDAwMTAwMCxcbiAgTlRMTV9OZWdvdGlhdGVPZW1Xb3Jrc3RhdGlvblN1cHBsaWVkOiAweDAwMDAyMDAwLFxuICBOVExNX1Vua25vd242OiAweDAwMDA0MDAwLFxuICBOVExNX05lZ290aWF0ZUFsd2F5c1NpZ246IDB4MDAwMDgwMDAsXG4gIE5UTE1fVGFyZ2V0VHlwZURvbWFpbjogMHgwMDAxMDAwMCxcbiAgTlRMTV9UYXJnZXRUeXBlU2VydmVyOiAweDAwMDIwMDAwLFxuICBOVExNX1RhcmdldFR5cGVTaGFyZTogMHgwMDA0MDAwMCxcbiAgTlRMTV9OZWdvdGlhdGVFeHRlbmRlZFNlY3VyaXR5OiAweDAwMDgwMDAwLFxuICBOVExNX05lZ290aWF0ZUlkZW50aWZ5OiAweDAwMTAwMDAwLFxuICBOVExNX1Vua25vd241OiAweDAwMjAwMDAwLFxuICBOVExNX1JlcXVlc3ROb25OVFNlc3Npb25LZXk6IDB4MDA0MDAwMDAsXG4gIE5UTE1fTmVnb3RpYXRlVGFyZ2V0SW5mbzogMHgwMDgwMDAwMCxcbiAgTlRMTV9Vbmtub3duNDogMHgwMTAwMDAwMCxcbiAgTlRMTV9OZWdvdGlhdGVWZXJzaW9uOiAweDAyMDAwMDAwLFxuICBOVExNX1Vua25vd24zOiAweDA0MDAwMDAwLFxuICBOVExNX1Vua25vd24yOiAweDA4MDAwMDAwLFxuICBOVExNX1Vua25vd24xOiAweDEwMDAwMDAwLFxuICBOVExNX05lZ290aWF0ZTEyODogMHgyMDAwMDAwMCxcbiAgTlRMTV9OZWdvdGlhdGVLZXlFeGNoYW5nZTogMHg0MDAwMDAwMCxcbiAgTlRMTV9OZWdvdGlhdGU1NjogMHg4MDAwMDAwMFxufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU5UTE1SZXF1ZXN0KG9wdGlvbnM6IHsgZG9tYWluOiBzdHJpbmcsIHdvcmtzdGF0aW9uPzogc3RyaW5nIH0pIHtcbiAgY29uc3QgZG9tYWluID0gZXNjYXBlKG9wdGlvbnMuZG9tYWluLnRvVXBwZXJDYXNlKCkpO1xuICBjb25zdCB3b3Jrc3RhdGlvbiA9IG9wdGlvbnMud29ya3N0YXRpb24gPyBlc2NhcGUob3B0aW9ucy53b3Jrc3RhdGlvbi50b1VwcGVyQ2FzZSgpKSA6ICcnO1xuXG4gIGxldCB0eXBlMWZsYWdzID0gTlRMTUZsYWdzLk5UTE1fTmVnb3RpYXRlVW5pY29kZSArIE5UTE1GbGFncy5OVExNX05lZ290aWF0ZU9FTSArIE5UTE1GbGFncy5OVExNX1JlcXVlc3RUYXJnZXQgKyBOVExNRmxhZ3MuTlRMTV9OZWdvdGlhdGVOVExNICsgTlRMTUZsYWdzLk5UTE1fTmVnb3RpYXRlT2VtRG9tYWluU3VwcGxpZWQgKyBOVExNRmxhZ3MuTlRMTV9OZWdvdGlhdGVPZW1Xb3Jrc3RhdGlvblN1cHBsaWVkICsgTlRMTUZsYWdzLk5UTE1fTmVnb3RpYXRlQWx3YXlzU2lnbiArIE5UTE1GbGFncy5OVExNX05lZ290aWF0ZVZlcnNpb24gKyBOVExNRmxhZ3MuTlRMTV9OZWdvdGlhdGVFeHRlbmRlZFNlY3VyaXR5ICsgTlRMTUZsYWdzLk5UTE1fTmVnb3RpYXRlMTI4ICsgTlRMTUZsYWdzLk5UTE1fTmVnb3RpYXRlNTY7XG4gIGlmICh3b3Jrc3RhdGlvbiA9PT0gJycpIHtcbiAgICB0eXBlMWZsYWdzIC09IE5UTE1GbGFncy5OVExNX05lZ290aWF0ZU9lbVdvcmtzdGF0aW9uU3VwcGxpZWQ7XG4gIH1cblxuICBjb25zdCBmaXhlZERhdGEgPSBCdWZmZXIuYWxsb2MoNDApO1xuICBjb25zdCBidWZmZXJzID0gW2ZpeGVkRGF0YV07XG4gIGxldCBvZmZzZXQgPSAwO1xuXG4gIG9mZnNldCArPSBmaXhlZERhdGEud3JpdGUoJ05UTE1TU1AnLCBvZmZzZXQsIDcsICdhc2NpaScpO1xuICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50OCgwLCBvZmZzZXQpO1xuICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MzJMRSgxLCBvZmZzZXQpO1xuICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MzJMRSh0eXBlMWZsYWdzLCBvZmZzZXQpO1xuICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRShkb21haW4ubGVuZ3RoLCBvZmZzZXQpO1xuICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRShkb21haW4ubGVuZ3RoLCBvZmZzZXQpO1xuICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MzJMRShmaXhlZERhdGEubGVuZ3RoICsgd29ya3N0YXRpb24ubGVuZ3RoLCBvZmZzZXQpO1xuICBvZmZzZXQgPSBmaXhlZERhdGEud3JpdGVVSW50MTZMRSh3b3Jrc3RhdGlvbi5sZW5ndGgsIG9mZnNldCk7XG4gIG9mZnNldCA9IGZpeGVkRGF0YS53cml0ZVVJbnQxNkxFKHdvcmtzdGF0aW9uLmxlbmd0aCwgb2Zmc2V0KTtcbiAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDMyTEUoZml4ZWREYXRhLmxlbmd0aCwgb2Zmc2V0KTtcbiAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDgoNSwgb2Zmc2V0KTtcbiAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDgoMCwgb2Zmc2V0KTtcbiAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDE2TEUoMjE5NSwgb2Zmc2V0KTtcbiAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDgoMCwgb2Zmc2V0KTtcbiAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDgoMCwgb2Zmc2V0KTtcbiAgb2Zmc2V0ID0gZml4ZWREYXRhLndyaXRlVUludDgoMCwgb2Zmc2V0KTtcbiAgZml4ZWREYXRhLndyaXRlVUludDgoMTUsIG9mZnNldCk7XG5cbiAgYnVmZmVycy5wdXNoKEJ1ZmZlci5mcm9tKHdvcmtzdGF0aW9uLCAnYXNjaWknKSk7XG4gIGJ1ZmZlcnMucHVzaChCdWZmZXIuZnJvbShkb21haW4sICdhc2NpaScpKTtcblxuICByZXR1cm4gQnVmZmVyLmNvbmNhdChidWZmZXJzKTtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsTUFBTUEsU0FBUyxHQUFHO0VBQ2hCQyxxQkFBcUIsRUFBRSxVQUFVO0VBQ2pDQyxpQkFBaUIsRUFBRSxVQUFVO0VBQzdCQyxrQkFBa0IsRUFBRSxVQUFVO0VBQzlCQyxhQUFhLEVBQUUsVUFBVTtFQUN6QkMsa0JBQWtCLEVBQUUsVUFBVTtFQUM5QkMsa0JBQWtCLEVBQUUsVUFBVTtFQUM5QkMsc0JBQXNCLEVBQUUsVUFBVTtFQUNsQ0MsMkJBQTJCLEVBQUUsVUFBVTtFQUN2Q0MsYUFBYSxFQUFFLFVBQVU7RUFDekJDLGtCQUFrQixFQUFFLFVBQVU7RUFDOUJDLG9CQUFvQixFQUFFLFVBQVU7RUFDaENDLGNBQWMsRUFBRSxVQUFVO0VBQzFCQywrQkFBK0IsRUFBRSxVQUFVO0VBQzNDQyxvQ0FB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
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/bulk-load-payload.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BulkLoadPayload = void 0;
class BulkLoadPayload {
    constructor(bulkLoad){
        this.bulkLoad = bulkLoad;
        // We need to grab the iterator here so that `error` event handlers are set up
        // as early as possible (and are not potentially lost).
        this.iterator = this.bulkLoad.rowToPacketTransform[Symbol.asyncIterator]();
    }
    [Symbol.asyncIterator]() {
        return this.iterator;
    }
    toString(indent = '') {
        return indent + 'BulkLoad';
    }
}
exports.BulkLoadPayload = BulkLoadPayload; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJCdWxrTG9hZFBheWxvYWQiLCJjb25zdHJ1Y3RvciIsImJ1bGtMb2FkIiwiaXRlcmF0b3IiLCJyb3dUb1BhY2tldFRyYW5zZm9ybSIsIlN5bWJvbCIsImFzeW5jSXRlcmF0b3IiLCJ0b1N0cmluZyIsImluZGVudCIsImV4cG9ydHMiXSwic291cmNlcyI6WyIuLi9zcmMvYnVsay1sb2FkLXBheWxvYWQudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJ1bGtMb2FkIGZyb20gJy4vYnVsay1sb2FkJztcblxuZXhwb3J0IGNsYXNzIEJ1bGtMb2FkUGF5bG9hZCBpbXBsZW1lbnRzIEFzeW5jSXRlcmFibGU8QnVmZmVyPiB7XG4gIGRlY2xhcmUgYnVsa0xvYWQ6IEJ1bGtMb2FkO1xuICBkZWNsYXJlIGl0ZXJhdG9yOiBBc3luY0l0ZXJhYmxlSXRlcmF0b3I8QnVmZmVyPjtcblxuICBjb25zdHJ1Y3RvcihidWxrTG9hZDogQnVsa0xvYWQpIHtcbiAgICB0aGlzLmJ1bGtMb2FkID0gYnVsa0xvYWQ7XG5cbiAgICAvLyBXZSBuZWVkIHRvIGdyYWIgdGhlIGl0ZXJhdG9yIGhlcmUgc28gdGhhdCBgZXJyb3JgIGV2ZW50IGhhbmRsZXJzIGFyZSBzZXQgdXBcbiAgICAvLyBhcyBlYXJseSBhcyBwb3NzaWJsZSAoYW5kIGFyZSBub3QgcG90ZW50aWFsbHkgbG9zdCkuXG4gICAgdGhpcy5pdGVyYXRvciA9IHRoaXMuYnVsa0xvYWQucm93VG9QYWNrZXRUcmFuc2Zvcm1bU3ltYm9sLmFzeW5jSXRlcmF0b3JdKCk7XG4gIH1cblxuICBbU3ltYm9sLmFzeW5jSXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzLml0ZXJhdG9yO1xuICB9XG5cbiAgdG9TdHJpbmcoaW5kZW50ID0gJycpIHtcbiAgICByZXR1cm4gaW5kZW50ICsgKCdCdWxrTG9hZCcpO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUVPLE1BQU1BLGVBQWUsQ0FBa0M7RUFJNURDLFdBQVdBLENBQUNDLFFBQWtCLEVBQUU7SUFDOUIsSUFBSSxDQUFDQSxRQUFRLEdBQUdBLFFBQVE7O0lBRXhCO0lBQ0E7SUFDQSxJQUFJLENBQUNDLFFBQVEsR0FBRyxJQUFJLENBQUNELFFBQVEsQ0FBQ0Usb0JBQW9CLENBQUNDLE1BQU0sQ0FBQ0MsYUFBYSxDQUFDLENBQUMsQ0FBQztFQUM1RTtFQUVBLENBQUNELE1BQU0sQ0FBQ0MsYUFBYSxJQUFJO0lBQ3ZCLE9BQU8sSUFBSSxDQUFDSCxRQUFRO0VBQ3RCO0VBRUFJLFFBQVFBLENBQUNDLE1BQU0sR0FBRyxFQUFFLEVBQUU7SUFDcEIsT0FBT0EsTUFBTSxHQUFJLFVBQVc7RUFDOUI7QUFDRjtBQUFDQyxPQUFBLENBQUFULGVBQUEsR0FBQUEsZUFBQSIsImlnbm9yZUxpc3QiOltdfQ==
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/special-stored-procedure.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
const procedures = {
    Sp_Cursor: 1,
    Sp_CursorOpen: 2,
    Sp_CursorPrepare: 3,
    Sp_CursorExecute: 4,
    Sp_CursorPrepExec: 5,
    Sp_CursorUnprepare: 6,
    Sp_CursorFetch: 7,
    Sp_CursorOption: 8,
    Sp_CursorClose: 9,
    Sp_ExecuteSql: 10,
    Sp_Prepare: 11,
    Sp_Execute: 12,
    Sp_PrepExec: 13,
    Sp_PrepExecRpc: 14,
    Sp_Unprepare: 15
};
var _default = exports.default = procedures;
module.exports = procedures; //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJwcm9jZWR1cmVzIiwiU3BfQ3Vyc29yIiwiU3BfQ3Vyc29yT3BlbiIsIlNwX0N1cnNvclByZXBhcmUiLCJTcF9DdXJzb3JFeGVjdXRlIiwiU3BfQ3Vyc29yUHJlcEV4ZWMiLCJTcF9DdXJzb3JVbnByZXBhcmUiLCJTcF9DdXJzb3JGZXRjaCIsIlNwX0N1cnNvck9wdGlvbiIsIlNwX0N1cnNvckNsb3NlIiwiU3BfRXhlY3V0ZVNxbCIsIlNwX1ByZXBhcmUiLCJTcF9FeGVjdXRlIiwiU3BfUHJlcEV4ZWMiLCJTcF9QcmVwRXhlY1JwYyIsIlNwX1VucHJlcGFyZSIsIl9kZWZhdWx0IiwiZXhwb3J0cyIsImRlZmF1bHQiLCJtb2R1bGUiXSwic291cmNlcyI6WyIuLi9zcmMvc3BlY2lhbC1zdG9yZWQtcHJvY2VkdXJlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IHByb2NlZHVyZXMgPSB7XG4gIFNwX0N1cnNvcjogMSxcbiAgU3BfQ3Vyc29yT3BlbjogMixcbiAgU3BfQ3Vyc29yUHJlcGFyZTogMyxcbiAgU3BfQ3Vyc29yRXhlY3V0ZTogNCxcbiAgU3BfQ3Vyc29yUHJlcEV4ZWM6IDUsXG4gIFNwX0N1cnNvclVucHJlcGFyZTogNixcbiAgU3BfQ3Vyc29yRmV0Y2g6IDcsXG4gIFNwX0N1cnNvck9wdGlvbjogOCxcbiAgU3BfQ3Vyc29yQ2xvc2U6IDksXG4gIFNwX0V4ZWN1dGVTcWw6IDEwLFxuICBTcF9QcmVwYXJlOiAxMSxcbiAgU3BfRXhlY3V0ZTogMTIsXG4gIFNwX1ByZXBFeGVjOiAxMyxcbiAgU3BfUHJlcEV4ZWNScGM6IDE0LFxuICBTcF9VbnByZXBhcmU6IDE1XG59O1xuXG5leHBvcnQgZGVmYXVsdCBwcm9jZWR1cmVzO1xubW9kdWxlLmV4cG9ydHMgPSBwcm9jZWR1cmVzO1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxNQUFNQSxVQUFVLEdBQUc7RUFDakJDLFNBQVMsRUFBRSxDQUFDO0VBQ1pDLGFBQWEsRUFBRSxDQUFDO0VBQ2hCQyxnQkFBZ0IsRUFBRSxDQUFDO0VBQ25CQyxnQkFBZ0IsRUFBRSxDQUFDO0VBQ25CQyxpQkFBaUIsRUFBRSxDQUFDO0VBQ3BCQyxrQkFBa0IsRUFBRSxDQUFDO0VBQ3JCQyxjQUFjLEVBQUUsQ0FBQztFQUNqQkMsZUFBZSxFQUFFLENBQUM7RUFDbEJDLGNBQWMsRUFBRSxDQUFDO0VBQ2pCQyxhQUFhLEVBQUUsRUFBRTtFQUNqQkMsVUFBVSxFQUFFLEVBQUU7RUFDZEMsVUFBVSxFQUFFLEVBQUU7RUFDZEMsV0FBVyxFQUFFLEVBQUU7RUFDZkMsY0FBYyxFQUFFLEVBQUU7RUFDbEJDLFlBQVksRUFBRTtBQUNoQixDQUFDO0FBQUMsSUFBQUMsUUFBQSxHQUFBQyxPQUFBLENBQUFDLE9BQUEsR0FFYWxCLFVBQVU7QUFDekJtQixNQUFNLENBQUNGLE9BQU8sR0FBR2pCLFVBQVUiLCJpZ25vcmVMaXN0IjpbXX0=
}),
"[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tedious.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BulkLoad", {
    enumerable: true,
    get: function() {
        return _bulkLoad.default;
    }
});
Object.defineProperty(exports, "Connection", {
    enumerable: true,
    get: function() {
        return _connection.default;
    }
});
Object.defineProperty(exports, "ConnectionError", {
    enumerable: true,
    get: function() {
        return _errors.ConnectionError;
    }
});
Object.defineProperty(exports, "ISOLATION_LEVEL", {
    enumerable: true,
    get: function() {
        return _transaction.ISOLATION_LEVEL;
    }
});
Object.defineProperty(exports, "Request", {
    enumerable: true,
    get: function() {
        return _request.default;
    }
});
Object.defineProperty(exports, "RequestError", {
    enumerable: true,
    get: function() {
        return _errors.RequestError;
    }
});
Object.defineProperty(exports, "TDS_VERSION", {
    enumerable: true,
    get: function() {
        return _tdsVersions.versions;
    }
});
Object.defineProperty(exports, "TYPES", {
    enumerable: true,
    get: function() {
        return _dataType.TYPES;
    }
});
exports.connect = connect;
exports.library = void 0;
var _bulkLoad = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/bulk-load.js [app-route] (ecmascript)"));
var _connection = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/connection.js [app-route] (ecmascript)"));
var _request = _interopRequireDefault(__turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/request.js [app-route] (ecmascript)"));
var _library = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/library.js [app-route] (ecmascript)");
var _errors = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/errors.js [app-route] (ecmascript)");
var _dataType = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/data-type.js [app-route] (ecmascript)");
var _transaction = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/transaction.js [app-route] (ecmascript)");
var _tdsVersions = __turbopack_context__.r("[project]/Downloads/ITTickting Sys/node_modules/.pnpm/tedious@19.2.0/node_modules/tedious/lib/tds-versions.js [app-route] (ecmascript)");
function _interopRequireDefault(e) {
    return e && e.__esModule ? e : {
        default: e
    };
}
const library = exports.library = {
    name: _library.name
};
function connect(config, connectListener) {
    const connection = new _connection.default(config);
    connection.connect(connectListener);
    return connection;
} //# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfYnVsa0xvYWQiLCJfaW50ZXJvcFJlcXVpcmVEZWZhdWx0IiwicmVxdWlyZSIsIl9jb25uZWN0aW9uIiwiX3JlcXVlc3QiLCJfbGlicmFyeSIsIl9lcnJvcnMiLCJfZGF0YVR5cGUiLCJfdHJhbnNhY3Rpb24iLCJfdGRzVmVyc2lvbnMiLCJlIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJsaWJyYXJ5IiwiZXhwb3J0cyIsIm5hbWUiLCJjb25uZWN0IiwiY29uZmlnIiwiY29ubmVjdExpc3RlbmVyIiwiY29ubmVjdGlvbiIsIkNvbm5lY3Rpb24iXSwic291cmNlcyI6WyIuLi9zcmMvdGVkaW91cy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQnVsa0xvYWQgZnJvbSAnLi9idWxrLWxvYWQnO1xuaW1wb3J0IENvbm5lY3Rpb24sIHsgdHlwZSBDb25uZWN0aW9uQXV0aGVudGljYXRpb24sIHR5cGUgQ29ubmVjdGlvbkNvbmZpZ3VyYXRpb24sIHR5cGUgQ29ubmVjdGlvbk9wdGlvbnMgfSBmcm9tICcuL2Nvbm5lY3Rpb24nO1xuaW1wb3J0IFJlcXVlc3QgZnJvbSAnLi9yZXF1ZXN0JztcbmltcG9ydCB7IG5hbWUgfSBmcm9tICcuL2xpYnJhcnknO1xuXG5pbXBvcnQgeyBDb25uZWN0aW9uRXJyb3IsIFJlcXVlc3RFcnJvciB9IGZyb20gJy4vZXJyb3JzJztcblxuaW1wb3J0IHsgVFlQRVMgfSBmcm9tICcuL2RhdGEtdHlwZSc7XG5pbXBvcnQgeyBJU09MQVRJT05fTEVWRUwgfSBmcm9tICcuL3RyYW5zYWN0aW9uJztcbmltcG9ydCB7IHZlcnNpb25zIGFzIFREU19WRVJTSU9OIH0gZnJvbSAnLi90ZHMtdmVyc2lvbnMnO1xuXG5jb25zdCBsaWJyYXJ5ID0geyBuYW1lOiBuYW1lIH07XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0KGNvbmZpZzogQ29ubmVjdGlvbkNvbmZpZ3VyYXRpb24sIGNvbm5lY3RMaXN0ZW5lcj86IChlcnI/OiBFcnJvcikgPT4gdm9pZCkge1xuICBjb25zdCBjb25uZWN0aW9uID0gbmV3IENvbm5lY3Rpb24oY29uZmlnKTtcbiAgY29ubmVjdGlvbi5jb25uZWN0KGNvbm5lY3RMaXN0ZW5lcik7XG4gIHJldHVybiBjb25uZWN0aW9uO1xufVxuXG5leHBvcnQge1xuICBCdWxrTG9hZCxcbiAgQ29ubmVjdGlvbixcbiAgUmVxdWVzdCxcbiAgbGlicmFyeSxcbiAgQ29ubmVjdGlvbkVycm9yLFxuICBSZXF1ZXN0RXJyb3IsXG4gIFRZUEVTLFxuICBJU09MQVRJT05fTEVWRUwsXG4gIFREU19WRVJTSU9OXG59O1xuXG5leHBvcnQgdHlwZSB7XG4gIENvbm5lY3Rpb25BdXRoZW50aWNhdGlvbixcbiAgQ29ubmVjdGlvbkNvbmZpZ3VyYXRpb24sXG4gIENvbm5lY3Rpb25PcHRpb25zXG59O1xuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsU0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsV0FBQSxHQUFBRixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUUsUUFBQSxHQUFBSCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUcsUUFBQSxHQUFBSCxPQUFBO0FBRUEsSUFBQUksT0FBQSxHQUFBSixPQUFBO0FBRUEsSUFBQUssU0FBQSxHQUFBTCxPQUFBO0FBQ0EsSUFBQU0sWUFBQSxHQUFBTixPQUFBO0FBQ0EsSUFBQU8sWUFBQSxHQUFBUCxPQUFBO0FBQXlELFNBQUFELHVCQUFBUyxDQUFBLFdBQUFBLENBQUEsSUFBQUEsQ0FBQSxDQUFBQyxVQUFBLEdBQUFELENBQUEsS0FBQUUsT0FBQSxFQUFBRixDQUFBO0FBRXpELE1BQU1HLE9BQU8sR0FBQUMsT0FBQSxDQUFBRCxPQUFBLEdBQUc7RUFBRUUsSUFBSSxFQUFFQTtBQUFLLENBQUM7QUFFdkIsU0FBU0MsT0FBT0EsQ0FBQ0MsTUFBK0IsRUFBRUMsZUFBdUMsRUFBRTtFQUNoRyxNQUFNQyxVQUFVLEdBQUcsSUFBSUMsbUJBQVUsQ0FBQ0gsTUFBTSxDQUFDO0VBQ3pDRSxVQUFVLENBQUNILE9BQU8sQ0FBQ0UsZUFBZSxDQUFDO0VBQ25DLE9BQU9DLFVBQVU7QUFDbkIiLCJpZ25vcmVMaXN0IjpbXX0=
}),
];

//# sourceMappingURL=9c4f3_tedious_lib_92b84d08._.js.map