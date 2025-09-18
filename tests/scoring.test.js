import { ruleScore } from '../scoring.js';

describe('ruleScore', () => {
  const offer = {
    name: 'AI Sales Assistant',
    value_props: ['Automates lead scoring', 'Improves conversion'],
    ideal_use_cases: ['SaaS', 'AI'],
  };

  test('awards 20 points for decision-maker roles (head/chief/director)', () => {
    const lead = {
      name: 'Alice',
      role: 'Head of Marketing',
      company: 'TechCorp',
      industry: 'SaaS',
      location: 'NY',
      linkedin_bio: 'Experienced growth leader',
    };
    expect(ruleScore(lead, offer)).toBe(50); // 20 role + 20 industry + 10 completeness
  });

  test('awards 10 points for manager/lead roles', () => {
    const lead = {
      name: 'Bob',
      role: 'Marketing Manager',
      company: 'FlowMetrics',
      industry: 'AI',
      location: 'SF',
      linkedin_bio: 'Marketing professional',
    };
    expect(ruleScore(lead, offer)).toBe(40); // 10 role + 20 industry + 10 completeness
  });

  test('awards completeness points only if all fields are present', () => {
    const lead = {
      name: 'Charlie',
      role: 'Director',
      company: 'StartUpX',
      industry: 'SaaS',
      location: '', // missing
      linkedin_bio: 'Innovator',
    };
    expect(ruleScore(lead, offer)).toBe(40); // 20 role + 20 industry + 0 completeness
  });

  test('awards 10 industry points if value_props exist but no match', () => {
    const lead = {
      name: 'David',
      role: 'Engineer',
      company: 'BuildCorp',
      industry: 'Construction', // not matching SaaS/AI
      location: 'Berlin',
      linkedin_bio: 'Engineer profile',
    };
    expect(ruleScore(lead, offer)).toBe(20); // 10 industry fallback + 10 completeness
  });

  test('returns 10 only for completeness when irrelevant role/industry', () => {
    const lead = {
      name: 'Eve',
      role: 'Intern',
      company: 'UnknownCo',
      industry: 'Retail',
      location: 'Delhi',
      linkedin_bio: 'Intern',
    };
    expect(ruleScore(lead, offer)).toBe(10); // only completeness
  });
});
