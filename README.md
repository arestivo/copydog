# CopyDog

<img src="https://raw.githubusercontent.com/arestivo/copydog/master/copydog.svg?token=GHSAT0AAAAAAB26JKSHJBUUKFPWW3FEE33EZDV3JMQ" width="100" height="100" align="left">

A command-line interface (CLI) tool crafted to empower users in identifying projects with similar code bases. Operating on the premise that each project resides in its own dedicated folder, this tool leverages the capabilities of *ssdeep* to conduct comprehensive file-by-file comparisons.

This tool is specifically designed to address the critical task of detecting potential plagiarism between student submissions. By analyzing the codebase similarities and employing the robustness of *ssdeep*, it swiftly identifies resemblances and patterns that might indicate instances of unauthorized code sharing.

This invaluable tool serves as a guardian of academic integrity, assisting educators and institutions in ensuring a level playing field for students. It streamlines the process of identifying code similarities, enabling prompt detection and intervention when necessary.

Experience the power and precision of this CLI tool as it diligently uncovers potential plagiarism within student submissions, promoting fairness and upholding academic standards.

## Install

```
npm install -g copydog
```

or

```
yarn global add copydog
```

## Usage

All flags are optional.

```
copydog -f proj -e js,php,css -t 60 -p 20
```

In this illustrative example, the tool assumes a project structure where each project is organized within a dedicated folder, identified by the "proj" prefix. It only compares files with extensions ".js", ".php", and ".css".

To determine similarity, the tool employs the *ssdeep* algorithm, considering two files to be sufficiently similar if a minimum similarity score of 60% is achieved. Furthermore, when assessing projects for potential suspicion, the tool identifies cases where at least 20% of the analyzed files exhibit similarities.

## Help

```
Options:
      --version     Show version number                                [boolean]
  -f, --folders     list of folders to compare (prefix)   [string] [default: ""]
  -e, --extensions  list of extensions to consider
                                           [string] [default: "php,css,html,js"]
  -t, --threshold   threshold for a file to be considered the same
                                                          [number] [default: 50]
  -p, --print       percentage of matched files to be printed
                                                          [number] [default: 30]
      ----help
```
