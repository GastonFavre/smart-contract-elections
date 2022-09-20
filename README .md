
# Elecciones descentralizadas

Desvot es un sistema de votación descentralizado que permite a los votantes
(registrados) votar a los candidatos (registrados) y cuando finaliza la votación
anunciar un ganador, los votos que recibió, el recuento total de votos, la
recaudación total de la votación y mostrar el saldo del propietario. Para
registrarse, el candidato debe pagar una tarifa (wei). El propietario del contrato
agrega el candidato al contrato para ser votado y a los votantes.


## Instrucciones para ejecución
 - Iniciar ganache
 - Ejecutar `truffle migrate` en la carpeta smart-contract
 - Ejecutar `ng serve` en la carpeta frontend/sistema-de-votacion
 - Importar a metamask al menos 5 cuentas incluida la del dueño del contrato, importante no crear cuentas nuevas sino importarlas a traves de su clave privada
 - Listo a probar las votaciones descentralizadas!
## Validaciones

- Cualquiera puede registrarse como pre-candidato
- Solo el dueño puede registrar un candidato
- Solo el dueño puede registrar un votante
- Solo el dueño puede cambiar los estados de la elección


## Deployment

Para deployar este proyecto

```bash
  npm install
```


## 🛠 Skills
Typescript, HTML, CSS, Solidity, Web3, Angular

