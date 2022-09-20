const Election = artifacts.require("Election");

contract("Election", (accounts) => {
  describe( "Creacion de eleccion, agregado de candidatos y votantes, inicio de eleccion, votacion y anuncio de ganador", async () => 
  {
    describe('Creacion de eleccion', async () => {
      it("Crear elección", async () => {
        const electionInstance = await Election.deployed();
        const electionName = await electionInstance.electionName();
        assert.equal(electionName, "Elections");
      });
    });
      it("Pagar Fee y registrar candidato 1", async () => {
        const electionInstance = await Election.deployed();
        await electionInstance.payFee({ from: accounts[1], value: 100 });
        const balance = await electionInstance.balanceOf();
        assert.equal(balance.toString(), 100);
        const account = await electionInstance.candidates(accounts[1]);
        assert.equal(account.registered, true);
      });
      it("Pagar Fee y registrar candidato 2", async () => {
        const electionInstance = await Election.deployed();
        await electionInstance.payFee({ from: accounts[4], value: 100 });
        const balance = await electionInstance.balanceOf();
        assert.equal(balance.toString(), 200);
        const account = await electionInstance.candidates(accounts[4]);
        assert.equal(account.registered, true);
      });
      it("Agregar candidato 1", async () => {
        const electionInstance = await Election.deployed();
        const totalCandidates = await electionInstance.getTotalCandidates();
        await electionInstance.addCandidate(accounts[1], "Gaston");
        const candidate = await electionInstance.candidates(accounts[1]);
        assert.equal(candidate.registered, true);
        assert.equal(candidate.name, "Gaston");
        assert.equal(candidate.voteCount, 0);
        assert((await electionInstance.getTotalCandidates()) > totalCandidates);
      });
      it("Agregar candidato 2", async () => {
        const electionInstance = await Election.deployed();
        const totalCandidates = await electionInstance.getTotalCandidates();
        await electionInstance.addCandidate(accounts[4], "Sabri");
        const candidate = await electionInstance.candidates(accounts[4]);
        assert.equal(candidate.registered, true);
        assert.equal(candidate.name, "Sabri");
        assert.equal(candidate.voteCount, 0);
        assert((await electionInstance.getTotalCandidates()) > totalCandidates);
      });
      it("Registrar un votante 1", async () => {
        const electionInstance = await Election.deployed();
        await electionInstance.registerVoter(accounts[2]);
        const voter = await electionInstance.voters(accounts[2]);
        assert.equal(voter.registered, true);
      });
      it("Registrar un votante 2", async () => {
        const electionInstance = await Election.deployed();
        await electionInstance.registerVoter(accounts[3]);
        const voter = await electionInstance.voters(accounts[3]);
        assert.equal(voter.registered, true);
      });
      it("Inicializar votacion", async () => {
        const electionInstance = await Election.deployed();
        await electionInstance.startVote();
        const stateElection = await electionInstance.state();
        assert.equal(stateElection.toString(), 1);
      });
      it("Votar votante 1 a candidato 1", async () => {
        const electionInstance = await Election.deployed();
        const owner = await electionInstance.owner();
        const voter = await electionInstance.voters(accounts[2]);
        const notOwner = owner != voter;
        const candidate = await electionInstance.candidates(accounts[1]);
        const stateElection = await electionInstance.state();
        assert.equal(voter.registered, true);
        assert.equal(voter.voted, false);
        assert.equal(candidate.registered, true);
        assert.equal(stateElection.toString(), 1);
        assert.equal(notOwner, true);
        await electionInstance.vote(accounts[1], { from: accounts[2] });
        const candidateVoted = await electionInstance.candidates(accounts[1]);
        assert.equal(candidateVoted.voteCount, 1);
      });
      it("Votar votante 2 a candidato 1", async () => {
        const electionInstance = await Election.deployed();
        const owner = await electionInstance.owner();
        const voter = await electionInstance.voters(accounts[3]);
        const notOwner = owner != voter;
        const candidate = await electionInstance.candidates(accounts[1]);
        const stateElection = await electionInstance.state();
        assert.equal(voter.registered, true);
        assert.equal(voter.voted, false);
        assert.equal(candidate.registered, true);
        assert.equal(stateElection.toString(), 1);
        assert.equal(notOwner, true);
        await electionInstance.vote(accounts[1], { from: accounts[3] });
        const candidateVoted = await electionInstance.candidates(accounts[1]);
        assert.equal(candidateVoted.voteCount, 2);
      });
      it("Anunciar ganador candidato 1", async () => {
        const electionInstance = await Election.deployed();
        await electionInstance.endVote();
        const stateElection = await electionInstance.state();
        assert.equal(stateElection.toString(), 2);
        const winner = await electionInstance.announceWinner();
        assert.equal(winner, accounts[1]);
      });
  });
});