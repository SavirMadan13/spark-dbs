export default function initializeS(label, numContacts) {
  const S = {};

  // Assign label
  S.label = Array.isArray(label) ? label[0] : label;

  // Initialize right sources
  for (let source = 1; source <= 4; source++) {
    S[`Rs${source}`] = { case: {}, amp: 0, va: 2, pulseWidth: 60 };
    for (let k = 1; k <= numContacts; k++) {
      S[`Rs${source}`][`k${k}`] = { perc: 0, pol: 0, imp: 1 };
    }
    S[`Rs${source}`].case.perc = 100;
    S[`Rs${source}`].case.pol = 2;
  }

  // Initialize left sources
  for (let source = 1; source <= 4; source++) {
    S[`Ls${source}`] = { case: {}, amp: 0, va: 2, pulseWidth: 60 };
    for (let k = 1; k <= numContacts; k++) {
      S[`Ls${source}`][`k${k}`] = { perc: 0, pol: 0, imp: 1 };
    }
    S[`Ls${source}`].case.perc = 100;
    S[`Ls${source}`].case.pol = 2;
  }

  // Assign additional properties
  S.active = [1, 1];
  S.model = 'SimBio/FieldTrip (see Horn 2017)';
  S.monopolarmodel = 0;
  S.amplitude = [Array(4).fill(0), Array(4).fill(0)];
  S.numContacts = numContacts;
  S.sources = [1, 2, 3, 4];
  S.volume = [];
  S.ver = '2.0';
  return S;
}

