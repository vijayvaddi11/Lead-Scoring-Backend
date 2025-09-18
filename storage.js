let offer = null;
let leads = [];
let results = [];

export function saveOffer(newOffer) {
  offer = newOffer;
}

export function getOffer() {
  return offer;
}

export function saveLeads(newLeads) {
  leads = newLeads;
}

export function getLeads() {
  return leads;
}

export function saveResults(newResults) {
  results = newResults;
}

export function getResults() {
  return results;
}
