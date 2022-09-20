// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
* @title Sistema de votación descentralizado que permite a los votantes (registrados) votar a los candidatos (registrados)
* y cuando finaliza la votación anuncia un ganador. Para registrarse, el candidato debe pagar una tarifa (wei).
* El propietario del contrato agrega el candidato al contrato para ser votado.
 */
contract Election {
    
    struct Candidate {
        string name;
        bool registered;
        uint voteCount;
    }

    struct Voter {
        bool voted;
        bool registered;
        address vote;
    }

    address[] public candidateAddresses;
    address public owner;
    string public electionName;

    mapping(address => Voter) public voters;
    mapping(address => Candidate) public candidates;
    uint public totalVotes;
    
    enum State { Created, Voting, Ended }
    State public state;

    modifier onlyOwner() {
        require(msg.sender == owner, "No eres el duenio del contrato");
        _;
    }
    
    modifier inState(State _state) {
        require(state == _state, "Estado incorrecto");
        _;
    }

    constructor(string memory _name) {
        owner = msg.sender;
        electionName = _name; 
        state = State.Created;
    }
    
    /**
    * @dev esta función registra un candidato, msg.sender será el candidato y msg.value debe ser 100 wei.
    * @notice esta función registra un candidato.
     */
    function payFee() public payable {
        require(msg.value == 1000000000000000000 wei, "Paga 1 eth para registrarte");
        candidates[msg.sender].registered = true;        
    }
    
    /**
    * @dev esta función registra un votante, _voterAddress será la dirección del votante y voters[registered] es la bandera.
    * @notice esta función registra un votante.
     */
    function registerVoter(address _voterAddress) onlyOwner inState(State.Created) public {
        require(!voters[_voterAddress].registered, "El votante ya se encuentra registrado");
        require(_voterAddress != owner, "El duenio del contrato no puede ser registrado");
        voters[_voterAddress].registered = true;
    }

    /**
    * @dev esta función añade un candidato, _canAddress será la dirección del candidato y _name será el nombre del candidato.
    * @notice esta función añade un candidato.
    * @param _canAddress dirección del candidato.
    * @param _name nombre del candidato.
     */
    function addCandidate(address _canAddress, string memory _name) inState(State.Created) onlyOwner public {
        require(candidates[_canAddress].registered, "Candidato no registrado");
        candidates[_canAddress].name = _name;
        candidates[_canAddress].voteCount = 0;
        candidateAddresses.push(_canAddress);
    }

    /** 
    * @dev esta función establece el estado a Creado.
    * @notice esta función indica el inicio de la elección..
    */
    function startVote() public inState(State.Created) onlyOwner {
        state = State.Voting;
    }

    /**
    * @dev  Esta función emite el voto. 
            Requiere que el votante no haya votado ya.
            Requiere que el estado del candidato sea registrado y requiere que el 
            propietario no pueda votar. Especifica la dirección por la que ha votado 
            el votante y establece la bandera para indicar que el votante ya ha votado. 
            Incrementa el recuento de votos del candidato y el recuento total de votos.
    * @notice Esta función emite el voto.
    * @param _canAddress dirección del candidato.
     */
    function vote(address _canAddress) inState(State.Voting) public {
        require(voters[msg.sender].registered, "Votante no registrado");
        require(!voters[msg.sender].voted, "El votante solo puede votar una vez");
        require(candidates[_canAddress].registered, "Candidato no registrado");
        require(msg.sender!=owner, "El duenio del contrato no puede votar"); 

        voters[msg.sender].vote = _canAddress;
        voters[msg.sender].voted = true;
        candidates[_canAddress].voteCount++;
        totalVotes++;
    }

    /** 
    * @dev Esta función establece el estado de Votación.
    * @notice esta función indica el fin del proceso de votación.
    */
    function endVote() public inState(State.Voting) onlyOwner {
        state = State.Ended;
    }
    
    /** 
    * @dev esta función anuncia la dirección del ganador, compara el recuento de votos de todos los candidatos.
    * @notice esta función anuncia el ganador.
    */
    function announceWinner() inState(State.Ended) onlyOwner public view returns (address) {
        uint max = 0;
        uint i;
        address winnerAddress;
        for(i=0; i<candidateAddresses.length; i++) {
            if(candidates[candidateAddresses[i]].voteCount > max) {
                max = candidates[candidateAddresses[i]].voteCount;
                winnerAddress = candidateAddresses[i];
            }
        }
        return winnerAddress;
    }
    
    /** 
    * @dev esta función devuelve la longitud de la matriz candidateAddress.
    * @notice esta función devuelve el número total de candidatos.
    */
    function getTotalCandidates() public view returns(uint) {
        return candidateAddresses.length;
    }
    
    /** 
    * @dev esta función devuelve el saldo del contrato.
    * @notice esta función devuelve el saldo del contrato.
    */
    function balanceOf() public view returns(uint) {
        return address(this).balance;
    }
    
    /** 
    * @dev esta función transfiere los fondos del contrato al propietario.
    * @notice esta función retira los fondos.
    */
    function withdrawRegistrationFunds() onlyOwner inState(State.Ended) payable public {
        require(address(this).balance > 0, "Sin fondos");
        payable(owner).transfer(address(this).balance);
    }
    
    /** 
    * @dev esta función devuelve el saldo del propietario
    * @notice esta función devuelve el saldo del propietario
    */
    function getOwnerBalance() public view returns(uint) {
        return owner.balance;
    }
    
}