/* Services */
import { graphqlService } from 'services/graphqlService';

/* Fragments */
import { analysisEntryFragment } from './fragments';

/* Mappers */
import { analysisEntryMapper } from './mappers';

/* Types */
import { GQLAnalysisEntry } from './types';
import { AnalysisEntry } from 'App/types';

export type GQLRetrieveAnalysisEntriesVars = Partial<{
  names: string[];
  attributes: string[];
  groups: string[];
  attributesDicts: Partial<{
    name: string;
    value: string;
  }>[];
}>;

interface GQLRetrieveAnalysisEntries {
  retrieveAnalysisEntries: GQLAnalysisEntry[];
}

const RetrieveAnalysisEntries = `query(
  $names: [String]
  $attributes: [String]
  $groups: [String]
  $attributesDicts: [InputAttributeDict]
) {
  retrieveAnalysisEntries(
    names: $names 
    attributes: $attributes
    groups: $groups
    attributesDicts: $attributesDicts
  ) ${analysisEntryFragment} 
}`;

export const retrieveAnalysisEntriesQuery = async (
  variables: GQLRetrieveAnalysisEntriesVars
): Promise<AnalysisEntry[]> => {
  const {
    retrieveAnalysisEntries: entries = []
  } = await graphqlService.graphqlOperation<
    GQLRetrieveAnalysisEntriesVars,
    GQLRetrieveAnalysisEntries
  >(RetrieveAnalysisEntries, variables);

  return entries.map(analysisEntryMapper);
};
