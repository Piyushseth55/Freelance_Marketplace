// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract FreelanceMarketplace is ERC721, ReentrancyGuard {
    // Token for platform fees and rewards
    IERC20 public workToken;

    // Structures
    struct Agent {
        address owner;
        string aiModel;        // GPT-4, Code Interpreter, etc.
        uint256 reputation;    // Agent's reputation score
        uint256 totalJobs;    // Total jobs completed
        uint256 stakedTokens; // $WORK tokens staked
        bool isVerified;      // Verification status
    }

    struct Job {
        uint256 jobId;
        address client;
        string title;
        string description;
        uint256 budget;
        address agent;         // AI agent address
        string deliverables;   // IPFS hash of deliverables
        bool isCompleted;
        bool exists;
        JobState state;
        uint256 deadline;
        string requiredSkills; // JSON string of required skills
        uint256 escrowAmount;
    }

    struct Bid {
        address agent;
        uint256 amount;
        string proposal;       // IPFS hash of AI-generated proposal
        bool accepted;
        uint256 timestamp;
    }

    struct Rating {
        uint256 score;        // 1-5 rating
        string feedback;      // IPFS hash of feedback
        uint256 timestamp;
    }

    // Enums
    enum JobState { 
        Open,           // Job is open for bids
        InProgress,     // Agent is working
        UnderReview,    // Work submitted for review
        Completed,      // Client approved
        Disputed,       // In dispute resolution
        Cancelled      // Job cancelled
    }

    // State variables
    uint256 private jobCounter;
    uint256 private agentCounter;
    uint256 private constant PLATFORM_FEE = 2; // 2% platform fee
    
    mapping(uint256 => Job) public jobs;
    mapping(uint256 => Bid[]) public jobBids;
    mapping(address => Agent) public agents;
    mapping(uint256 => Rating) public jobRatings;
    mapping(address => uint256) public userBalances;
    mapping(address => uint256[]) public agentJobs;
    
    // Events
    event AgentRegistered(address indexed owner, string aiModel);
    event JobCreated(uint256 indexed jobId, address indexed client, string title, uint256 budget);
    event BidPlaced(uint256 indexed jobId, address indexed agent, uint256 amount);
    event JobAssigned(uint256 indexed jobId, address indexed agent);
    event WorkDelivered(uint256 indexed jobId, string deliverablesHash);
    event JobCompleted(uint256 indexed jobId, uint256 rating);
    event DisputeRaised(uint256 indexed jobId, address indexed raiser);
    event NFTMinted(uint256 indexed jobId, address indexed agent);

    constructor(address _workToken) ERC721("ProofOfWork", "POW") {
        workToken = IERC20(_workToken);
    }

    // Modifiers
    modifier jobExists(uint256 _jobId) {
        require(jobs[_jobId].exists, "Job does not exist");
        _;
    }

    modifier onlyClient(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].client, "Only client can perform this");
        _;
    }

    modifier onlyAgent(uint256 _jobId) {
        require(msg.sender == jobs[_jobId].agent, "Only assigned agent can perform this");
        _;
    }

    modifier onlyVerifiedAgent() {
        require(agents[msg.sender].isVerified, "Agent not verified");
        _;
    }

    // Main Functions
    function registerAgent(string memory _aiModel) external {
        require(agents[msg.sender].owner == address(0), "Agent already registered");
        
        agents[msg.sender] = Agent({
            owner: msg.sender,
            aiModel: _aiModel,
            reputation: 0,
            totalJobs: 0,
            stakedTokens: 0,
            isVerified: false
        });

        emit AgentRegistered(msg.sender, _aiModel);
    }

    function stakeTokens(uint256 _amount) external {
        require(agents[msg.sender].owner != address(0), "Agent not registered");
        require(workToken.transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        
        agents[msg.sender].stakedTokens += _amount;
    }

    function createJob(
        string memory _title, 
        string memory _description, 
        string memory _requiredSkills,
        uint256 _deadline
    ) external payable {
        require(msg.value > 0, "Budget must be greater than 0");
        
        jobCounter++;
        jobs[jobCounter] = Job({
            jobId: jobCounter,
            client: msg.sender,
            title: _title,
            description: _description,
            budget: msg.value,
            agent: address(0),
            deliverables: "",
            isCompleted: false,
            exists: true,
            state: JobState.Open,
            deadline: _deadline,
            requiredSkills: _requiredSkills,
            escrowAmount: msg.value
        });

        emit JobCreated(jobCounter, msg.sender, _title, msg.value);
    }

    function placeBid(
        uint256 _jobId, 
        uint256 _amount, 
        string memory _proposalHash
    ) external jobExists(_jobId) onlyVerifiedAgent {
        require(jobs[_jobId].state == JobState.Open, "Job not open for bids");
        require(_amount <= jobs[_jobId].budget, "Bid exceeds budget");

        Bid memory newBid = Bid({
            agent: msg.sender,
            amount: _amount,
            proposal: _proposalHash,
            accepted: false,
            timestamp: block.timestamp
        });
        
        jobBids[_jobId].push(newBid);
        emit BidPlaced(_jobId, msg.sender, _amount);
    }

    function acceptBid(uint256 _jobId, uint256 _bidIndex) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
    {
        require(jobs[_jobId].state == JobState.Open, "Job not open");
        require(_bidIndex < jobBids[_jobId].length, "Invalid bid index");

        Bid storage selectedBid = jobBids[_jobId][_bidIndex];
        jobs[_jobId].agent = selectedBid.agent;
        jobs[_jobId].state = JobState.InProgress;
        selectedBid.accepted = true;

        // Add job to agent's portfolio
        agentJobs[selectedBid.agent].push(_jobId);

        emit JobAssigned(_jobId, selectedBid.agent);
    }

    function submitDeliverables(uint256 _jobId, string memory _deliverablesHash) 
        external 
        jobExists(_jobId) 
        onlyAgent(_jobId) 
    {
        require(jobs[_jobId].state == JobState.InProgress, "Job not in progress");
        
        jobs[_jobId].deliverables = _deliverablesHash;
        jobs[_jobId].state = JobState.UnderReview;
        
        emit WorkDelivered(_jobId, _deliverablesHash);
    }

    function approveAndRelease(uint256 _jobId, uint256 _rating, string memory _feedbackHash) 
        external 
        jobExists(_jobId) 
        onlyClient(_jobId) 
        nonReentrant 
    {
        require(jobs[_jobId].state == JobState.UnderReview, "Work not submitted");
        require(_rating >= 1 && _rating <= 5, "Invalid rating");
        
        Job storage job = jobs[_jobId];
        uint256 platformFee = (job.budget * PLATFORM_FEE) / 100;
        uint256 agentPayment = job.budget - platformFee;
        
        // Update job state
        job.state = JobState.Completed;
        job.isCompleted = true;
        
        // Store rating
        jobRatings[_jobId] = Rating({
            score: _rating,
            feedback: _feedbackHash,
            timestamp: block.timestamp
        });
        
        // Update agent stats
        Agent storage agent = agents[job.agent];
        agent.totalJobs++;
        agent.reputation = ((agent.reputation * (agent.totalJobs - 1)) + _rating) / agent.totalJobs;
        
        // Mint NFT proof of work
        _mintProofOfWork(_jobId, job.agent);
        
        // Transfer payments
        userBalances[job.agent] += agentPayment;
        
        emit JobCompleted(_jobId, _rating);
    }

    function withdrawBalance() external nonReentrant {
        uint256 balance = userBalances[msg.sender];
        require(balance > 0, "No balance to withdraw");
        
        userBalances[msg.sender] = 0;
        (bool success, ) = msg.sender.call{value: balance}("");
        require(success, "Transfer failed");
    }

    function raiseDispute(uint256 _jobId) external jobExists(_jobId) {
        require(
            msg.sender == jobs[_jobId].client || msg.sender == jobs[_jobId].agent,
            "Only client or agent can raise dispute"
        );
        require(jobs[_jobId].state != JobState.Disputed, "Dispute already raised");
        
        jobs[_jobId].state = JobState.Disputed;
        emit DisputeRaised(_jobId, msg.sender);
    }

    // NFT Functions
    function _mintProofOfWork(uint256 _jobId, address _agent) internal {
        _mint(_agent, _jobId);
        emit NFTMinted(_jobId, _agent);
    }

    // View Functions
    function getAgentJobs(address _agent) external view returns (uint256[] memory) {
        return agentJobs[_agent];
    }

    function getJobBids(uint256 _jobId) external view returns (Bid[] memory) {
        return jobBids[_jobId];
    }

    function getAgentStats(address _agent) external view returns (
        uint256 reputation,
        uint256 totalJobs,
        uint256 stakedTokens
    ) {
        Agent memory agent = agents[_agent];
        return (agent.reputation, agent.totalJobs, agent.stakedTokens);
    }
}