import { Connection, PublicKey } from '@solana/web3.js';
import { BN, Program, web3 } from '@coral-xyz/anchor';
import idl from './onchain_blog.json';
import { OnchainBlog } from './onchain_blog';

const network = "https://soft-dawn-bush.solana-devnet.quiknode.pro/62f9eca84a7d3e5d9afcab25f92a4914247ff5bc";
export const connection = new Connection(network, 'confirmed');

export const program = new Program<OnchainBlog>(idl as OnchainBlog, {
    connection
});



export const createPost = async (title: string, content: string, signer: PublicKey) => {
    try {
        const timestamp = new BN(Date.now());
        const timestampBuffer = timestamp.toArrayLike(Buffer, 'le', 8);

        const [postPda, bump] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("psolite"), signer.toBuffer(), timestampBuffer],
            program.programId
        );

        const postContext = {
            post: postPda,
            author: signer,
            systemProgram: web3.SystemProgram.programId,
        }

        const tx = await program.methods.createPost(title, content, timestamp)
            .accounts(postContext)
            .transaction()

        const { blockhash } = await connection.getLatestBlockhash({ commitment: "finalized" });
        tx.recentBlockhash = blockhash;
        tx.feePayer = signer;

        // const post = await program.account.post.fetch(postPda);
        // console.log("Original Post:", post.title);

        return tx
    } catch (e) {
        throw new Error((e as Error).message || "Failed");
    }
}

export const getPosts = async () => {
    const posts = await program.account.post.all();
    const allPosts = []
    for (const post of posts) {
        allPosts.push({
            id: post.publicKey.toString(),
            title: post.account.title,
            content: post.account.content,
            author: post.account.author.toString(),
            createdAt: post.account.createdAt.toNumber() * 1000,
            updatedAt: post.account.updatedAt.toNumber() * 1000,
            isPublished: post.account.isPublished
        });
    }
    return allPosts;
}

export const getOnePost = async (pda: string) => {
    const post = await program.account.post.fetch(pda);

    const view = {
        id: pda,
        title: post.title,
        content: post.content,
        author: post.author.toString(),
        createdAt: post.createdAt.toNumber() * 1000,
        updatedAt: post.updatedAt.toNumber() * 1000,
        isPublished: post.isPublished
    }

    return view
}

export const editPost = async (title: string, content: string, pda: string, user: string) => {

    try {
        const get = await getOnePost(pda);

        if (user !== get.author) {
            throw new Error("Not your Post");
        }
        if (title === get.title && content === get.content) {
            throw new Error("No Changes");
        }

        const signer = new PublicKey(user)
        const editContext = {
            post: pda,
            author: get.author,
        }

        const tx = await program.methods.editPost(title, content)
            .accounts(editContext)
            .transaction()

        const { blockhash } = await connection.getLatestBlockhash({ commitment: "finalized" });
        tx.recentBlockhash = blockhash;
        tx.feePayer = signer;

        return tx
    } catch (e) {
        throw new Error((e as Error).message || "Failed");
    }
}

export const deletePost = async (pda: string, user: string) => {
    try {
        const signer = new PublicKey(user)
        const get = await getOnePost(pda);
        if (user !== get.author) {
            throw new Error("Not your Post");
        }

        const deleteContext = {
            post: pda,
            author: signer,
        }

        const tx = await program.methods.deletePost()
            .accounts(deleteContext)
            .transaction()

        const { blockhash } = await connection.getLatestBlockhash({ commitment: "finalized" });
        tx.recentBlockhash = blockhash;
        tx.feePayer = signer;

        return tx
    } catch (e) {
        throw new Error((e as Error).message || "Failed");
    }
}

export const setPublish = async (pda: string, user: string) => {
    try {
        const signer = new PublicKey(user)
        const get = await getOnePost(pda);
        if (user !== get.author) {
            throw new Error("Not your Post");
        }
        const toggleContext = {
            post: pda,
            author: signer,
        }
        // Toggle the publish status
        const tx = await program.methods.togglePublish()
            .accounts(toggleContext)
            .transaction()

        const { blockhash } = await connection.getLatestBlockhash({ commitment: "finalized" });
        tx.recentBlockhash = blockhash;
        tx.feePayer = signer;

        return tx
    } catch (e) {
        throw new Error((e as Error).message || "Failed");
    }
}