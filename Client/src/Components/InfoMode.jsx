import resume from '../assets/brendonStuebenResume.pdf'

function InfoMode() {
  return (
    <main className="info-mode">
      <div className="content-box">
        <h2>Brendon Stueben</h2>
        <h3>bstueben2001@gmail.com</h3>
        <h3>(435) 225-5681</h3>
        <br/>
        <p>With a balanced understanding of fundamental coding and familiarity utilizing AI, my established skillset creates an environment of both progression and creative style.</p>
        <br/>
        <h2>highlight projects</h2>
        <h3>
          <a href="https://stalwart-v1-0.onrender.com/" target="_blank" rel="noopener noreferrer">
            Stalwart [BETA]
          </a>
        </h3><h3>
          <a href="" target="_blank" rel="noopener noreferrer">
            Merge
          </a>
        </h3><h3>
          <a href="" target="_blank" rel="noopener noreferrer">
            AlterEgo
          </a>
        </h3>
        <br/>
        <h2>links</h2>
        <h3>
          <a href="https://github.com/bstueben2001" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </h3>
        <h3>
          <a href="https://www.linkedin.com/in/brendon-stueben-01406a2ba" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </h3>
        <h3>
          <a href={resume} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
        </h3>
        <br/>
        <br/>
      </div>
    </main>
  )
}

export default InfoMode
