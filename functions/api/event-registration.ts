const store = env.KV_EVENT_REGISTRATION

export async function onRequestPost(ctx) {
    try {
        return await handleRequest(ctx);
    } catch (e) {
        return new Response(`${e.message}\n${e.stack}`, { status: 500 });
    }
}

async function handleRequest({ request, env }) {
    const formData = await request.formData();

    console.log(JSON.stringify(formData))

    // Validate form data
    //const organization = formData.get('Organization')
    const firstname = formData.get('First name')
    const lastname = formData.get('Last name')
    const email = formData.get('Email')

    if (firstname === '' || lastname === '' || email === '') {
        return Response.redirect(`${referer}?status=error`, 302)
    }

    const { data, metadata } = await store.getWithMetadata(email, {
        type: "json"
    });

    if (data === null) {
        // Add registration to the store
        await store.put(email, JSON.stringify(formData), {
            metadata: { created: Date.now() },
        })
    } else {
        // Update registration from store, if correct
        console.log(data)
        metadata['lastmod'] = Date.now()
        console.log(metadata)
    }

    return Response.redirect(`${referer}?status=success`, 302)
}