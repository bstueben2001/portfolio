import { INFO_ITEM_MAP } from '../data/infoItems'

function InfoMode() {
  const { email, phone, bio, stalwart, merge, alterego, github, linkedin, resume } = INFO_ITEM_MAP

  return (
    <main className="info-mode">
      <div className="content-box">
        <h2>Brendon Stueben</h2>
        <h3>{email.label}</h3>
        <h3>{phone.label}</h3>
        <br/>
        <p>{bio.label}</p>
        <br/>
        <h2>highlight projects</h2>
        <h3>
          <a href={stalwart.href} target="_blank" rel="noopener noreferrer">
            {stalwart.label}
          </a>
        </h3><h3>
          <a href={merge.href} target="_blank" rel="noopener noreferrer">
            {merge.label}
          </a>
        </h3><h3>
          <a href={alterego.href} target="_blank" rel="noopener noreferrer">
            {alterego.label}
          </a>
        </h3>
        <br/>
        <h2>links</h2>
        <h3>
          <a href={github.href} target="_blank" rel="noopener noreferrer">
            {github.label}
          </a>
        </h3>
        <h3>
          <a href={linkedin.href} target="_blank" rel="noopener noreferrer">
            {linkedin.label}
          </a>
        </h3>
        <h3>
          <a href={resume.href} target="_blank" rel="noopener noreferrer">
            {resume.label}
          </a>
        </h3>
        <br/>
        <br/>
      </div>
    </main>
  )
}

export default InfoMode
