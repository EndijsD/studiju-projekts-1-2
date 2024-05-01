import express from 'express';
import db from './db.js';
import moment from 'moment';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', async (req, res) => {
  // Iegūst vajadzīgās vērtības no padotās informācijas
  const tables = ['students', 'skolotajs'];
  const email = req.body.email;
  const password = req.body.password;

  // Veic vaicājumu datubāzei, kur iegūst ierakstu ar padoto e-pastu
  for (let i = 0; i < 2; i++) {
    db.query(
      `SELECT * FROM ${tables[i]} WHERE epasts=?`,
      email,
      (err, result) => {
        if (err && i == 1) {
          // Ja ir problēma, tad sūta atpakaļ problēmas ziņu
          res.status(500).json({ message: err.message });
        } else {
          // Iegūst pirmā elementa objektu, jo vaicājumi vienmēr ir masīvi ar ierakstiem, ja tādi ir atrasti
          const resultObj = result[0];

          if (resultObj) {
            // Ja ir ieraksts ar norādīto e-pasta adresi, tad vertificējam paroli,
            // ko lietotājs ievadīja, ar to kas ir datubāzē, savādāk nosūtam tukšu objektu
            const isCorrectPass = bcrypt.compareSync(
              password,
              resultObj.parole
            );

            if (isCorrectPass) {
              // Ja parole sakrīt ar to kas ir datubāzē, tad izveidojam JWT un nosūtam to atpakaļ,
              // savādāk nosūtam tukšu objektu
              const accessToken = jwt.sign(
                resultObj,
                // process.env.ACCESS_TOKEN_SECRET
                'bce8473f-33e8-4e75-8a10-6e4ce8a2421f'
              );

              res.send({ accessToken: accessToken, userType: i });
              i = 2;
            } else {
              if (i == 1) {
                res.send({});
              }
            }
          }
          // else {
          //   if (i == 1) {
          //     res.send({});
          //   }
          // }
        }
      }
    );
  }
});

export default router;