import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const ReplaceableContent = ({ title, content, form, buttonLabel }) => {
  const [showForm, setShowForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleShowForm = () => setShowForm(true);
  const handleShowContent = () => {
    setShowForm(false);
    setShowSuccessMessage(false);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      name: event.target.name.value,
      email: event.target.email.value,
      category: buttonLabel,
    }
    
    if (buttonLabel === "Contact Us") {
      formData.company = event.target.companyName.value; // Adjusted name to match "companyName" field
      formData.message = event.target.message.value;
    };

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxJ1QeSTIrHzvtVHCIeCYo7pHyZ4mesfOTRtOaUEv2KgOdVsUcr12y7ckMI3xuoUtEw/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setShowForm(false);
      setShowSuccessMessage(true);

      // Only revert back after 3 seconds if this is NOT the Corporations section
      if (title !== "Corporations" && title !== "UMD Professors") {
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  let displayedContent;
  if (showSuccessMessage) {
    // If we're showing success in the Corporations area, show a "Schedule a Call" button
    if (title === "Corporations" || title === "UMD Professors") {
      displayedContent = (
        <div>
          <p>Success! Your submission has been received. To learn more...</p>
          <button
            onClick={() => window.open("https://calendly.com/evrenyk", "_blank")}
            style={{
              marginTop: '1rem',
              backgroundColor: '#DC66FF',
              color: '#ffffff',
              fontSize: '1rem',
              border: 'none',
              padding: '0.8rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              width: '90%',
            }}
          >
            Schedule a Call
          </button>
        </div>
      );
    } 
    else {
      // For non-corporation/professor sections, just show the success message, revert after 3 seconds automatically
      displayedContent = <p>Success! Your submission has been received.</p>;
    }
  } else if (showForm) {
    const clonedForm = React.cloneElement(form, { onSubmit: handleFormSubmit });
    displayedContent = (
      <div>
        {clonedForm}
        <button onClick={handleShowContent} style={{
          marginTop: '1rem',
          backgroundColor: '#DC66FF',
          color: '#ffffff',
          fontSize: '1rem',
          border: 'none',
          padding: '0.8rem 1.5rem',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '90%',
        }}>
          Back
        </button>
      </div>
    );
  } else {
    displayedContent = (
      <div>
        {content}
        <button onClick={handleShowForm} style={{
          marginTop: '1rem',
          display: 'inline-block',
          padding: '1rem 2rem',
          backgroundColor: '#DC66FF',
          fontSize: '1.125rem',
          borderRadius: '8px',
          color: '#ffffff',
          border: 'none',
          cursor: 'pointer',
        }}>
          {buttonLabel}
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: showForm || showSuccessMessage ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.05)',
      padding: '1.5rem',
      borderRadius: '0.75rem',
      marginBottom: '1rem',
    }}>
      <h3 style={{
        fontSize: '1.2rem',
        color: '#ffffff',
        marginBottom: '0.5rem',
      }}>{title}</h3>
      {displayedContent}
    </div>
  );
};

const App = () => {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const mountRef = useRef(null);
 
  useEffect(() => {
    const currentMount = mountRef.current;
  
    // Scene setup
    const scene = new THREE.Scene();
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
    renderer.setSize(width, height);
    currentMount.appendChild(renderer.domElement);
  
    // Create thin line rings
    const geometry = new THREE.TorusGeometry(1, 0.0001, 64, 200);
    const edges = new THREE.EdgesGeometry(geometry);
    const material = new THREE.LineBasicMaterial({ color: 0xdc66ff });
  
    const ring1 = new THREE.LineSegments(edges, material);
    const ring2 = new THREE.LineSegments(edges, material);
    const ring3 = new THREE.LineSegments(edges, material);
    const ring4 = new THREE.LineSegments(edges, material);
  
    ring1.position.y += .5;
    ring2.position.y += .5;
    ring3.position.y += .5;
    ring4.position.y += .5;

    ring1.rotation.x = -Math.PI / 4;
    ring1.rotation.z = Math.PI / 4;
    ring2.rotation.x = Math.PI / 4;
    ring2.rotation.z = -Math.PI / 4;
    ring3.rotation.y = -Math.PI / 4;
    ring3.rotation.z = Math.PI / 4;
    ring4.rotation.y = Math.PI / 4;
    ring4.rotation.z = -Math.PI / 4;
  
    scene.add(ring1, ring2, ring3, ring4);
    camera.position.z = 5;
  
    // Animation
    const animate = () => {
      ring1.rotation.y += 0.005;
      ring2.rotation.y += 0.005;
      ring3.rotation.x += 0.005;
      ring4.rotation.x += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();
  
    // Cleanup
    return () => {
      currentMount.removeChild(renderer.domElement);
      geometry.dispose();
      edges.dispose();
      material.dispose();
      renderer.dispose();
      scene.children.forEach((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
    };
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      name: event.target.name.value,  
      email: event.target.email.value,
    };

    try {
      await fetch('https://script.google.com/macros/s/AKfycbxgfNvHTuIFNnyHxyBn_qn_4qv1ZmPGWk90IQQGKcPwRpJtkz-K3QXwe69AZd4GnxNz/exec', {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  const formSimple = (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem', // Adds space between elements
      width: '100%',
    }}>
      <label style={{ 
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '80%',
        margin: '0 auto',
        textAlign: 'left',
      }}>Name:
      <input type="text" name="name" placeholder="e.g., Jane Doe" required style={{
        fontSize: '1rem',
        width: 'calc(100% - 1rem - 2px)',
        alignItems: 'center',
        padding: '0.5rem',
        marginTop: '0.5rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
      }}/></label>
      <label style={{ 
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: '0 auto',
        textAlign: 'left',
        width: '80%',
      }}>Email:<input type="email" name="email" placeholder='e.g., joeblow@gmail.com' required style={{
        fontSize: '1rem',
        width: 'calc(100% - 1rem - 2px)',
        padding: '0.5rem',
        marginTop: '0.5rem',
        borderRadius: '5px',
        border: '1px solid #ccc',
      }}/></label>
      <button type="submit" style={{
        marginTop: '1rem',
        backgroundColor: '#DC66FF',
        color: '#ffffff',
        fontSize: '1rem',
        border: 'none',
        padding: '0.8rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '90%',
      }}>Submit</button>
    </form>
  );

  const formComplex = (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem', // Adds space between elements
      width: '100%',
    }}>
      <label style={{ 
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        width: '80%',
        margin: '0 auto',
        textAlign: 'left',
      }}>*Name:
        <input type="text" name="name" placeholder="e.g., Jane Doe" required style={{
          fontSize: '1rem',
          width: 'calc(100% - 1rem - 2px)',
          alignItems: 'center',
          padding: '0.5rem',
          marginTop: '0.5rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }} />
      </label>
      <label style={{ 
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: '0 auto',
        textAlign: 'left',
        width: '80%',
      }}>*Email:
        <input type="email" name="email" placeholder='e.g., joeshmo@gmail.com' required style={{
          fontSize: '1rem',
          width: 'calc(100% - 1rem - 2px)',
          padding: '0.5rem',
          marginTop: '0.5rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }} />
      </label>
      <label style={{ 
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: '0 auto',
        textAlign: 'left',
        width: '80%',
      }}>*Company Name:
        <input type="text" name="companyName" placeholder="e.g., Acme Corp" required style={{
          fontSize: '1rem',
          width: 'calc(100% - 1rem - 2px)',
          padding: '0.5rem',
          marginTop: '0.5rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
        }} />
      </label>
      <label style={{ 
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        margin: '0 auto',
        textAlign: 'left',
        width: '80%',
      }}>Message:
        <textarea name="message" placeholder="Write your message here..." style={{
          fontSize: '1rem',
          width: 'calc(100% - 1rem - 2px)',
          padding: '0.5rem',
          marginTop: '0.5rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
          resize: 'none',
          height: '100px', // Set height for the textarea
        }} />
      </label>
      <button type="submit" style={{
        marginTop: '1rem',
        backgroundColor: '#DC66FF',
        color: '#ffffff',
        fontSize: '1rem',
        border: 'none',
        padding: '0.8rem 1.5rem',
        borderRadius: '8px',
        cursor: 'pointer',
        width: '90%',
      }}>Submit</button>
    </form>
  );
  

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#100F1C',
    }}>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '5rem',
        backgroundColor: 'rgba(16, 15, 28, 0.9)', // Semi-transparent background
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 99, // Ensure it's above other elements
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Optional shadow for separation
      }}>
        <a href="doquantum.org" style={{
          display: 'flex',
          alignItems: 'center',
          textDecoration: 'none',
        }}>
          <img 
            src="/FullLogo_Transparent_NoBuffer.png" 
            alt="Do Quantum Logo" 
            style={{
              height: '3.5rem', // Adjust logo size
              cursor: 'pointer',
            }} 
          />
        </a>
      </header>
      <div ref={mountRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }} />
      <div style={{
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        fontFamily: '"Inter", system-ui, sans-serif',
        color: '#ffffff',
        padding: '0 20px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
          gap: '1rem', 
        }}>
          <p style={{
            fontSize: '1.5rem',
            maxWidth: '800px',
            margin: '15rem auto 13rem auto',
            lineHeight: '1.6',
            //color: '#a5b4fc',
            color: '#DC66FF',
          }}>
            A UMD researcher-run non-profit bridging the gap between quantum computing theory and practice. 
            We empower students to become quantum researchers and help companies 
            harness the power of quantum computing.
          </p>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.1rem',
            marginBottom: '0.5rem',
          }}>
            Our Spring 2024 Initiatives
          </h1>
          <div style={{
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.1)',
              padding: '2rem',
              borderRadius: '1rem',
              flex: '1',
              minWidth: '300px',
              maxWidth: '500px',
              backdropFilter: 'blur(10px)', // For most browsers
              WebkitBackdropFilter: 'blur(10px)', // For Safari on iOS
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}>
              <h2 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#ffffff',
              }}>Research Platform</h2>
              <div style={{
                color: '#a5b4fc',
                marginBottom: '1.5rem',
              }}>
                <div style={{
                  color: '#a5b4fc',
                  marginBottom: '1.5rem',
                }}></div>  
                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.5',
                }}>
                  Our platform will serve:
                </p>
                
                  <ReplaceableContent
                    title="UMD Students"
                    content={
                    <p>
                      Start with just Python knowledge. We'll help you build expertise in Quantum ML, NLP, and cryptography through interactive games, do research, get an advisor, and publish your work.
                    </p>
                    }
                    form={formSimple}
                    buttonLabel="Join Waitlist"
                    showSuccessMessage={showSuccessMessage}
                  />

                  <ReplaceableContent
                    title="UMD Professors"
                    content={
                      <p>
                        Share your expertise as a research advisor and publish faster. Choose your projects, set your availability, and guide the next generation of quantum researchers for as little as 1hr/week.
                      </p>
                    }
                    form={formSimple}
                    buttonLabel="Apply to Advise"
                    showSuccessMessage={showSuccessMessage}
                  />
                  </div>

                </div>
                <div style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  padding: '2rem',
                  borderRadius: '1rem',
                  flex: '1',
                  minWidth: '300px',
                  maxWidth: '500px',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}>
                  <h2 style={{
                    fontSize: '1.8rem',
                    marginBottom: '1rem',
                    color: '#ffffff',
                  }}>One Corporate Project</h2>
                  <p style={{
                    fontSize: '1.1rem',
                    color: '#a5b4fc',
                    lineHeight: '1.5',
                  }}>
                    We plan to serve:
                  </p>
                  <div style={{
                    color: '#a5b4fc',
                    marginBottom: '1.5rem',
                  }}>

                  <ReplaceableContent
                    title="UMD Students"
                    content={
                      <p>
                        Collaborate on a cutting-edge quantum computing project, guided by an experienced team lead, alongside fellow students and company advisors.
                      </p>
                    }
                    form={formSimple}
                    buttonLabel="Join Waitlist"
                    showSuccessMessage={showSuccessMessage}
                  />

                  <ReplaceableContent
                    title="Corporations"
                    content={
                      <p>
                        Work with an experienced team lead and dedicated student team on a quantum computing project. Only one company will be selected.
                      </p>
                    }
                    form={formComplex}
                    buttonLabel="Contact Us"
                    showSuccessMessage={showSuccessMessage}
                  />
                </div>
              </div>
            </div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.1rem',
                marginBottom: '0.5rem',
              }}>
                Meet Our Team
              </h1>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                margin: '0 auto',
                gap: '2rem',
                padding: '2rem',
                backgroundColor: '#100F1C',
              }}>
                {/* Team Member 1 */}
                <div style={{
                  maxWidth: '300px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: '#ffffff',
                }}>
                  <img
                    src="/evren-pic.png"
                    alt="Team Member 1"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      marginBottom: '1rem',
                      border: '3px solid #DC66FF',
                    }}
                  />
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem',
                    color: '#ffffff',
                  }}>
                    Evren Yücekuş~Kissane
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#a5b4fc',
                    marginBottom: '1rem',
                  }}>
                    Founder & CEO
                  </p>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#ffffff',
                    lineHeight: '1.6',
                  }}>
                    Evren has conducted and presented his own quantum NLP research, has 3+ years of experience developing software with ML and NLP, and has 2+ years of experience in R&D.
                  </p>
                </div>

                {/* Team Member 2 */}
                <div style={{
                  maxWidth: '300px',
                  textAlign: 'center',
                  backgroundColor: 'rgba(99, 102, 241, 0.1)',
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  color: '#ffffff',
                }}>
                  <img
                    src="/diego-pic.png"
                    alt="Team Member 2"
                    style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      marginBottom: '1rem',
                      border: '3px solid #DC66FF',
                    }}
                  />
                  <h3 style={{
                    fontSize: '1.5rem',
                    marginBottom: '0.5rem',
                    color: '#ffffff',
                  }}>
                    Diego Lopez
                  </h3>
                  <p style={{
                    fontSize: '1rem',
                    color: '#a5b4fc',
                    marginBottom: '1rem',
                  }}>
                    Backend Developer
                  </p>
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#ffffff',
                    lineHeight: '1.6',
                  }}>
                    Diego has leveraged his knowledge in data science and machine learning to develop a wide range of applications and web projects, from small-scale to complex systems, for the past 3+ years.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <footer style={{
            position: 'relative',
            bottom: 0,
            zIndex: 99,
            width: '100%',
            padding: '1rem 0 1rem 0',
            backgroundColor: 'rgba(16, 15, 28, 1)', // Solid background
            color: '#ffffff',
            textAlign: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)', // Optional border
            fontFamily: '"Inter", system-ui, sans-serif',
          }}>
            <p>
              Call or Text us: 
              <a href="tel:+19083071999" style={{
                color: '#DC66FF',
                textDecoration: 'none',
                marginLeft: '0.5rem',
              }}>+1 (908) 307-1999</a>
            </p>
            <p>
              Email us: <a href="mailto:doquantumresearch@gmail.com" style={{
                color: '#DC66FF',
                textDecoration: 'none',
                cursor: 'pointer',
              }}>doquantumresearch@gmail.com</a>
            </p>
          </footer>
        </div>
  );
};

export default App;