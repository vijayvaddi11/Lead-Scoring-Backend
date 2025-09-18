import { classifyLead } from './aiService.js';

// Rule layer scoring (max 50 points)
export function ruleScore(lead, offer) {
  let score = 0;
  const role = lead.role?.toLowerCase() || '';

  // Role relevance
  if (
    role.includes('head') ||
    role.includes('chief') ||
    role.includes('director')
  ) {
    score += 20; // decision maker
  } else if (role.includes('manager') || role.includes('lead')) {
    score += 10; // influencer
  }

  // Industry match
  if (
    offer.ideal_use_cases?.some((icp) =>
      lead.industry?.toLowerCase().includes(icp.toLowerCase())
    )
  ) {
    score += 20; // exact ICP match
  } else if (
    offer.adjacent_industries?.some((adj) =>
      lead.industry?.toLowerCase().includes(adj.toLowerCase())
    )
  ) {
    score += 10; // adjacent industry
  }

  // Data completeness
  if (
    lead.name &&
    lead.role &&
    lead.company &&
    lead.industry &&
    lead.location &&
    lead.linkedin_bio
  ) {
    score += 10;
  }

  return score;
}

// Main scoring pipeline
export async function scoreLeads(offer, leads) {
  const results = [];

  for (const lead of leads) {
    // Rule layer
    const rulePoints = ruleScore(lead, offer);

    // Default AI values
    let aiIntent = 'Low';
    let aiPoints = 10;
    let reasoning = 'AI call failed';

    try {
      const aiResult = await classifyLead(offer, lead);
      aiIntent = aiResult.intent;
      reasoning = aiResult.reasoning;

      if (aiIntent === 'High') aiPoints = 50;
      else if (aiIntent === 'Medium') aiPoints = 30;
      else aiPoints = 10;
    } catch (err) {
      console.error('⚠️ AI classification failed:', err.message);
    }

    const finalScore = rulePoints + aiPoints;

    results.push({
      ...lead,
      intent: aiIntent,
      score: finalScore,
      reasoning,
    });
  }

  return results;
}
