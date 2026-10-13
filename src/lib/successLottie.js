// Hand-authored Lottie (bodymovin) animation: a sand disc pops in, a clay ring draws, then a check mark.
const ease = { i: { x: [0.22], y: [1] }, o: { x: [0.36], y: [0] } };
const ease3 = { i: { x: [0.22, 0.22, 0.22], y: [1, 1, 1] }, o: { x: [0.36, 0.36, 0.36], y: [0, 0, 0] } };
const tr = { ty: 'tr', p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } };
const ks = (extra = {}) => ({ o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: [80, 80, 0] }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] }, ...extra });
const clay = [0.541, 0.353, 0.235, 1];
const ink = [0.137, 0.114, 0.094, 1];

export default {
  v: '5.7.4', fr: 60, ip: 0, op: 100, w: 160, h: 160, nm: 'success', ddd: 0, assets: [],
  layers: [
    {
      ddd: 0, ind: 3, ty: 4, nm: 'check', sr: 1, ao: 0, ip: 0, op: 100, st: 0, bm: 0,
      ks: ks(),
      shapes: [
        { ty: 'gr', nm: 'g', it: [
          { ty: 'sh', nm: 'p', ks: { a: 0, k: { i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]], v: [[-22, 2], [-7, 17], [23, -15]], c: false } } },
          { ty: 'st', nm: 's', c: { a: 0, k: ink }, o: { a: 0, k: 100 }, w: { a: 0, k: 6 }, lc: 2, lj: 2 },
          tr,
        ] },
        { ty: 'tm', nm: 'trim', s: { a: 0, k: 0 }, o: { a: 0, k: 0 }, m: 1, e: { a: 1, k: [{ t: 38, s: [0], ...ease }, { t: 66, s: [100] }] } },
      ],
    },
    {
      ddd: 0, ind: 2, ty: 4, nm: 'ring', sr: 1, ao: 0, ip: 0, op: 100, st: 0, bm: 0,
      ks: ks({ r: { a: 0, k: -90 } }),
      shapes: [
        { ty: 'gr', nm: 'g', it: [
          { ty: 'el', nm: 'e', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [118, 118] } },
          { ty: 'st', nm: 's', c: { a: 0, k: clay }, o: { a: 0, k: 100 }, w: { a: 0, k: 3 }, lc: 2, lj: 2 },
          tr,
        ] },
        { ty: 'tm', nm: 'trim', s: { a: 0, k: 0 }, o: { a: 0, k: 0 }, m: 1, e: { a: 1, k: [{ t: 8, s: [0], ...ease }, { t: 48, s: [100] }] } },
      ],
    },
    {
      ddd: 0, ind: 1, ty: 4, nm: 'disc', sr: 1, ao: 0, ip: 0, op: 100, st: 0, bm: 0,
      ks: ks({ s: { a: 1, k: [{ t: 0, s: [0, 0, 100], ...ease3 }, { t: 26, s: [108, 108, 100], ...ease3 }, { t: 40, s: [100, 100, 100] }] } }),
      shapes: [
        { ty: 'gr', nm: 'g', it: [
          { ty: 'el', nm: 'e', p: { a: 0, k: [0, 0] }, s: { a: 0, k: [104, 104] } },
          { ty: 'fl', nm: 'f', c: { a: 0, k: [0.914, 0.875, 0.812, 1] }, o: { a: 0, k: 100 }, r: 1 },
          tr,
        ] },
      ],
    },
  ],
};
