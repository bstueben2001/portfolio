import resume from '../assets/brendonStuebenResume.pdf'

function InfoMode() {
  return (
    <main className="info-mode">
      <div className="content-box">
        <h2>Brendon Stueben</h2>
        <h3>bstueben2001@gmail.com</h3>
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
        <p>Placeholder — add your bio here.</p>
      </div>
    </main>
  )
}

export default InfoMode
