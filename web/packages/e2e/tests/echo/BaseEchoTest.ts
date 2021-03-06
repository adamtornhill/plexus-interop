/**
 * Copyright 2017 Plexus Interop Deutsche Bank AG
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as plexus from "../../src/echo/gen/plexus-messages";
import { expect } from "chai";
import { MarshallerProvider, ProtoMarshallerProvider } from "@plexus-interop/client";
import { Arrays } from "@plexus-interop/common";


export class BaseEchoTest {

    protected marshallerProvider: MarshallerProvider = new ProtoMarshallerProvider();

    public assertEqual(first: plexus.plexus.interop.testing.IEchoRequest, second: plexus.plexus.interop.testing.IEchoRequest): void {

        let firstInt64;
        let secondInt64;

        if (!!first.int64Field && !!second.int64Field) {
            // chai's deep equal breaks on Long
            firstInt64 = first.int64Field;
            secondInt64 = second.int64Field;
            delete first.int64Field;
            delete second.int64Field;
            expect((firstInt64 as Long).high).is.eq((secondInt64 as Long).high);
            expect((firstInt64 as Long).low).is.eq((secondInt64 as Long).low);
        }

        expect(first).to.be.deep.equal(second);

        if (!!firstInt64 && !!secondInt64) {
            // return fields back
            first.int64Field = firstInt64;
            second.int64Field = secondInt64;
        }

    }

    public encodeRequestDto(request: plexus.plexus.interop.testing.IEchoRequest): ArrayBuffer {
        return Arrays.toArrayBuffer(this.marshallerProvider.getMarshaller(plexus.plexus.interop.testing.EchoRequest).encode(request));
    }

    public decodeRequestDto(payload: ArrayBuffer): plexus.plexus.interop.testing.IEchoRequest {
        return this.marshallerProvider.getMarshaller(plexus.plexus.interop.testing.EchoRequest).decode(new Uint8Array(payload));
    }

}