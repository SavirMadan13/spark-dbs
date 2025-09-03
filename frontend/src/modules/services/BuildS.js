export default function buildS(rightV, leftV, S) {
    S['Rs1']['amp'] = rightV.reduce((acc, val) => acc + val, 0);
    S['Ls1']['amp'] = leftV.reduce((acc, val) => acc + val, 0);
    S['Rs1']['va'] = 2;
    S['Ls1']['va'] = 2;
    S['Rs1']['case']['perc'] = 100;
    S['Ls1']['case']['perc'] = 100;
    S['Rs1']['case']['pol'] = 2;
    S['Ls1']['case']['pol'] = 2;
    
    // S['activecontacts'][0] = rightV.map(v => v !== 0 ? 1 : 0);
    // S['activecontacts'][1] = leftV.map(v => v !== 0 ? 1 : 0);
    
    S['amplitude'][0] = [rightV.reduce((acc, val) => acc + val, 0), 0, 0, 0];
    S['amplitude'][1] = [leftV.reduce((acc, val) => acc + val, 0), 0, 0, 0];
    
    const rightElec = S['Rs1'];
    const rightAmp = rightElec['amp'];

    rightV.forEach((value, i) => {
      const key = `k${i + 1}`;
      if (value !== 0) {
        const perc = Math.round((value / rightAmp) * 100);
        rightElec[key] = { perc, pol: 1 };
      } else {
        rightElec[key] = { perc: 0, pol: 0 };
      }
    });
  
    const leftElec = S['Ls1'];
    const leftAmp = leftElec['amp'];
    leftV.forEach((value, i) => {
      const key = `k${i + 1}`;
      if (value !== 0) {
        const perc = Math.round((value / leftAmp) * 100);
        leftElec[key] = { perc, pol: 1 };
      } else {
        leftElec[key] = { perc: 0, pol: 0 };
      }
    });
  
    return S;
  }