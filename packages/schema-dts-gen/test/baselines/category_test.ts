/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview Baseline tests are a set of tests (in tests/baseline/) that
 * correspond to full comparisons of a generate .ts output based on a set of
 * Triples representing an entire ontology.
 */
import {basename} from 'path';

import {inlineCli} from '../helpers/main_driver.js';

test(`baseline_${basename(import.meta.url)}`, async () => {
  const {actual, actualLogs} = await inlineCli(
    `
<http://schema.org/name> <http://schema.org/rangeIncludes> <http://schema.org/Text> .
<http://schema.org/name> <http://schema.org/domainIncludes> <http://schema.org/Thing> .
<http://schema.org/name> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/1999/02/22-rdf-syntax-ns#Property> .
<http://schema.org/Thing> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://schema.org/Distillery> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
<http://schema.org/Distillery> <http://www.w3.org/2000/01/rdf-schema#subClassOf> <http://schema.org/Thing> .
<http://schema.org/Distillery> <http://purl.org/dc/terms/source> <https://github.com/schemaorg/schemaorg/issues/743> .
<http://schema.org/Distillery> <http://schema.org/category> "issue-743" .
<http://schema.org/Distillery> <http://www.w3.org/2000/01/rdf-schema#label> "Distillery" .
<http://schema.org/Distillery> <http://www.w3.org/2000/01/rdf-schema#comment> "A distillery." .
<http://schema.org/Text> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://schema.org/DataType> .
<http://schema.org/Text> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2000/01/rdf-schema#Class> .
`,
    [
      '--ontology',
      `https://fake.com/${basename(import.meta.url)}.nt`,
      '--verbose',
    ],
  );

  expect(actual).toMatchInlineSnapshot(`
"/** Used at the top-level node to indicate the context for the JSON-LD objects used. The context provided in this type is compatible with the keys and URLs in the rest of this generated file. */
export type WithContext<T extends Thing> = T & {
    "$context": "https://schema.org";
};
export interface Graph {
    "$context": "https://schema.org";
    "$graph": readonly Thing[];
}
type SchemaValue<T> = T | readonly T[];
type IdReference = {
    /** IRI identifying the canonical address of this object. */
    "$id": string;
};
type InputActionConstraints<T extends ActionBase> = Partial<{
    [K in Exclude<keyof T, \`@\${string}\`> as \`\${string & K}-input\`]: PropertyValueSpecification | string;
}>;
type OutputActionConstraints<T extends ActionBase> = Partial<{
    [K in Exclude<keyof T, \`@\${string}\`> as \`\${string & K}-output\`]: PropertyValueSpecification | string;
}>;
/** Provides input and output action constraints for an action. */
export type WithActionConstraints<T extends ActionBase> = T & InputActionConstraints<T> & OutputActionConstraints<T>;

export type Text = string;

interface DistilleryLeaf extends ThingBase {
    "$type": "Distillery";
}
/** A distillery. */
export type Distillery = DistilleryLeaf;

interface ThingBase extends Partial<IdReference> {
    "name"?: SchemaValue<Text>;
}
interface ThingLeaf extends ThingBase {
    "$type": "Thing";
}
export type Thing = ThingLeaf | Distillery;

"
`);
  expect(actualLogs).toMatchInlineSnapshot(`
    "Loading Ontology from URL: https://fake.com/category_test.ts.nt
    Got Response 200: Ok.
    Class Distillery: Did not add [(source 743),(category issue-743),(label Distillery)]
    "
  `);
});
