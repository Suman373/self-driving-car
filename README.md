
# Self Driving Car with ANN

This project simulates a self-driving car in a 2D environment powered by a simple feedforward Artificial Neural Network (ANN). The goal is to create a car that can learn to navigate roads and avoid obstacles using sensor inputs and neural network predictions.



### Demo
You can visit this link for a live demo - [Click here](https://suman373.github.io/self-driving-car)



### Table of Contents

- [Key Features](#key-features)
- [Local Development & Setup](#local-development--setup)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [Theory & Neural Network Basics](#theory--neural-network-basics)
- [Screenshots](#screenshots)
- [Acknowledgements](#acknowledgements)
- [Feedback](#feedback)
- [License](#license)
  

### Key Features 

- **Ray-based Sensor System**: Uses ray tracing to cast vision rays and detect obstacles such as other cars in traffic and road boundaries.

- **Collision Detection**: Assesses damage based on polygon intersections with borders and traffic.


- **Realistic Car Physics**: Acceleration, friction, and turning are handled like real world physics.

- **Neural Network Control**: The car's movement decisions (forward, left, right, reverse) are driven by ANN outputs. (It also has key based controls for debugging purpose).

- **Genetic Mutation**: Evolves neural network weights and biases using controlled randomness to improve driving performance.

- **Visualization**: Draws the neural network on canvas with nodes, weights, biases and output activations.



### Local Development & Setup

 Getting started with the project locally
- Fork the repository
- Clone your fork in your local machine `git clone <url>.git`
- Start the Live Server in VS code

If you don't have the extension in your VS Code, you can install it from here - [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).

### Tech Stack

**HTML5, CSS3, Javascript (ES6), ES-Lint**


### Usage

- Update the `N=1` to `N=1000` in `main.js`. This runs multiple cars in parallel, allowing for faster mutation and testing of the neural network. Then click on the save `🗃️` button to save the best-performing brain to localstorage.  

- 🔦 Toggles the car’s sensor rays, helping you visualize how it detects the environment and obstacles. 

- 🗃️ Stores the current best-performing car’s neural network (brain) in your browser’s local storage for reuse across sessions.

- 🗑️ Deletes the saved brain from local storage, allowing for fresh training and potentially better results.


### Theory & Neural Network Basics

#### Segment Intersection Formula
```
If there are 2 lines, AB with A(x1,y1) and B(x2,y2) and CD with C(x3,y3) and D(x4,y4), we need to find t and u respectively to get the intersection point

Any point P on AB can be :
P = A+(B-A)t - lerp
 = Ax+(Bx-Ax)t, Ay + (By-Ay) where t ε [0,1]

Similarly ,
Q = C+(D-C)u - lerp
 = Cx+(Dx-Cx)u , Cy+(Dy-Cy)u

For lines to intersect at I, it should be on both AB and CD. Therefore,

Ix = Ax+(Bx-Ax)t = Cx+(Dx-Cx)u --- eq 1
Iy = Ay+(By-Ay)t = Cy+(Dy-Cy)u --- eq 2

Now, by subtracting Cx from eq 1 we get
=> (Ax-Cx) + (Bx-Ax)t = (Dx-Cx)u -- eq 3

By subtracting Cy from eq 2 we get,
=> (Ay-Cy)+(By-Ay)t = (Dy-Cy)u

Multiplying eq 2 by (Dx-Cx), we get
=> (Ay-Cy)(Dx-Cx) + (Dx-Cx)(By-Ay)t = (Dx-Cx)(Dy-Cy)u --- eq 4

Putting value of eq 3 in eq 4, we get

=> (Ay-Cy)(Dx-Cx) + (Dx-Cx)(By-Ay)t = (Ax-Cx) (Dy-Cy) + (Bx-Ay)t (Dy-Cy)  | - (Dy-Cy)(Ax-Cx)
                            | - (Dx-Cx)(By-Ay)t

=> (Ay-Cy)(Dx-Cx) - (Dy-Cy) (Ax-Cx) = (Dy-Cy)(Bx-Ax)t - (Dx-Cx)(By-Ay)t 

Therefore, 

t = (Ay-Cy)(Dx-Cx) - (Dy-Cy)(Ax-Cx) / (Dy-Cy)(Bx-Ax) - (Dx-Cx)(By-Ay)

t = top/bottom ( t is the interpolation factor)
```

#### Basics of Biological Neuron (BNN)

A biological neuron or a nerve cell, is the fundamental unit of the nervous system. It is responsible for transmitting information throughout the body via electrical and chemical signals.

I. Structure

I.1 Cell body (soma) - Contains the nucleus and other essential organelles - act as control center
I.2 Dendrites - Branch-like extensions that receive signals from other neurons

I.3 Axon - Long thing projections that transmits signals away from the cell body to the other neurons / cells.

I.4 Synapse - This is the junction where a neuron transmits signals to another cell.

I.5 Myelin sheath - Fatty layer that insulates and protects the axon

The brain is intrinsically a biological neural network (BNN) composed of tens of billions of biological neurons connected with each other.

#### Basics of Artificial Neuron (ANN)

An artificial neuron or a node is a mathematical function that serves as building block of artificial neural networks (ANN). It receives multiple inputs, processes them and then produces a single output. This output is passed to other artificial neurons forming a network which helps in solving complex problems.

I. Components 

I.1 Inputs and Outputs - Inputs are data points from real world which are processed and then produced as output.

I.2 Weights - Each input is associated with a weight, which represents the strength or importance of the signal.

I.3 Summation - The weighted sum of all the inputs 

I.4 Bias - Learnable parameter (constant value), added to the summation before passed to the activation function. Bias is analogous to the intercept in linear equation. It shifts the activation function, allowing the network to represent functions that don't necessarily pass through the origin.

I.5 Activation function - The summation is passed through an activation function (mathematical function) which introduces non-linearity to the neuron's behaviour. It determines whether the neuron should be activated and generate the output based on the weighted sum.

Common activation functions are : 
 - Sigmoid
 - Rectified Linear Unit (ReLU)
 - Tanh (Hyperbolic tangent)
 - Softmax 

I.6 Learning - The weights and activation function are adjusted during the learning process to improve the ANN's ability to perform specific complex tasks e.g., image recognition, NLP, etc.


#### Neuroevolution

The process of introducing random changes to the structure or parameter of an artificial neural network during evolution. The genetic mutation helps network adapt to new data patterns and improve its performance.

Types of mutations :
i. Structural mutations - alters the network's topology such as adding or removing nodes or connections.

ii. Weight mutations - modification of the numerical values of the node's weights and biases.

iii. Adaptive mutations - dynamic adjustment of the mutation rate or parameters during evolution which improves search efficiency.

#### Genetic Algorithm For the Car













### Screenshots

<img width="1000" height="562" alt="SelfDrivingExample" src="https://github.com/user-attachments/assets/e139bfba-4a48-4e75-91c7-bbafac90f4a4" />



https://github.com/user-attachments/assets/9ff8d806-3f79-4a43-9e42-7bb99c58b8e0



### Acknowledgements

 - [Radu Mariescu-Istodor](https://www.youtube.com/@Radu)
 - [Readme Editor](https://readme.so/editor)


### Feedback

For feedbacks reach out to me at iamsuman898@gmail.com


### License

[MIT](./LICENSE)

