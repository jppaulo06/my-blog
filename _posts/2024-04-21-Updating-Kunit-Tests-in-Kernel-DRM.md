---
layout: post
background: conway
---

[Work in progress]

## Introduction

For those who don't know, I'm currently working on a Scientific Initiation
project over Linux Kernel development at University of São Paulo (USP), under
orientation of professor Paulo Meirelles [1]. Officially, we've started weeks
ago, but actually we are here for... a while. With some go's and out's, It has
been almost 5 months since I've started studying Kernel development topics
together with FLUSP friends such as Marcelo Schmitt (the incredible guy who
presented me this universe), Marcelo Spessoto and David Tadokoro. You know,
entering the Kernel world is such a big challenge, and having these guys with
me has been absolutely incredible!

Well, briefly, my Scientific Initiation project is about developing Unit Tests
over the AMD Direct Rendering Manager Subsystem (keep calm, I will explain it
in a momment). This blog relates to the first patch-set I sent about it!
Since this is my first blog post, I'll try the more explanatory as possible :)

### First of all, Why Unit Tests?

Linux Kernel is such a huge ammount of complex code with thousands
and thousands of contributors around the world. One could imagine that a
mainteners job isn't easy, since bugs and regressions can be inserted with
ease if not careful with the patches applied.
Therefore, it may seem reasonable to have unit tests to guarantee that nothing
will suddenly explode due to regressions and bugs; and that's the reason why
unit tests are becoming more popular day after day in Linux code [2].

Different subsystems used to create unit tests in a different way, which lead
to chaos. But, recently, they defined a default framework to test C code in
Linux Kernel:
[Kunit](https://www.kernel.org/doc/html/latest/dev-tools/kunit/index.html).
Please, don't be afraid for the unknown; It's pretty much
straight foward: you write some tests code (with a logic like  `if
(potato.color != "yellow") abort;`), configure it to make it compilable, and
run a kind of magic command that compiles everything; then, you run the
compiled kernel, and it outputs the tests results. Yes, it creates a virtual
machine automatically with QEMU just to run your tests! The output is something
like this:

![Alt text]({{ site.baseurl }}/assets/images/test-output.png "Tests output")

You can even specify the processor architecture for the compilation. You may
think that the default one is X86-64, right? No, the default is UML, which is
a architecture made to run Linux Kernel inside a process.

### Direct Rendering Manager

I keep calling it a Subsystem, but actually I'm talking about AMD (yes, the
graphic card producer) GPU Direct Rendering Manager (also called DRM) driver.
Basically, it's the amdgpu driver, the one that lets your user programs
interact with your AMD Graphics Card, if you use one.

![Alt text]({{ site.baseurl }}/assets/images/x11-drm.png "DRM")

Direct Rendering Manager has a ton of details that I wouldn't like to talk
about in this post, but if you are interested, you can read more about it
[here](https://en.wikipedia.org/wiki/Direct_Rendering_Manager).

### A bit of lore (literally)

Back in 2022, Magali, Tales and Maíra, as a Google Summer of Code project,
started working on implementing unit tests in the AMD DRM driver. But since
Unit Tests didn't exist in AMD DRM, they had to come up with their own
structure (like directory organization, filenames and general configurations).
It seems like the community liked the idea a lot, however, although they got to
send a [patch-set to the AMD GPU mailing
list](https://lore.kernel.org/amd-gfx/20220912155919.39877-1-mairacanal@riseup.net/),
the work wasn't merged, and then got lost in time...

![Alt text]({{ site.baseurl }}/assets/images/ring.png)

Until now, when, february 2024, Siqueira [resent the patch-set to the mailing
list](https://lore.kernel.org/amd-gfx/20240222155811.44096-1-Rodrigo.Siqueira@amd.com/)
as a form of attempt to revive the work. This is where I come in and why this
blog post exist: the idea of my project is to continue developing Kunit tests
over the AMD DRM subsystem, starting from the already done work done by Magali,
Tales and Maíra.

## This week Patch-set

The patch-set I sent this week focus on fixing some problems I saw reviewing the
old one. The first thing I noticed was that the command recommended to run the tests
didn't work, and that was because the path to the configuration file wasn't
correct. It was recommended to run the following command, which expects to
exist a file called `.kunitconfig` in `drivers/gpu/drm/amd/display/tests`, like
this:

```bash
$ ./tools/testing/kunit/kunit.py run --arch=x86_64 \
	    --kunitconfig=drivers/gpu/drm/amd/display/tests
```

However, the directory "tests" was actually called "test", and also the
`.kunitconfig` path should be `drivers/gpu/drm/amd/display/test/kunit`. That
is, for some reason, there were conflicting informations inside the patch-set.
I suppose that this problem happened because they probably changed the
architecture of the tests just before sending the patch set. Looking at
their [gitlab development
repository](https://gitlab.freedesktop.org/isinyaaa/linux/-/merge_requests/8/commits),
it seems that the recommended command in fact makes a lot of sense.

Some of the other problems I found probably happened because of the same
reason. So I'll just let the cover letter here and hope it's enough to
understand everything :P

```
[WHY]

1.	The single test suite in the file
	test/kunit/dc/dml/calcs/bw_fixed_test.c, which tests some static
	functions defined in the dc/basics/bpw_fixed.c, is not being run.
	According to kunit documentation
	(https://www.kernel.org/doc/html/latest/dev-tools/kunit/usage.html#testing-static-functions),
	there are two strategies for testing
	static functions, but none of them seem to be configured. Additionally,
	it appears that the Config DCE_KUNIT_TEST should be associated with this
	test, since it was introduced in the same patch of the test
	(https://lore.kernel.org/amd-gfx/20240222155811.44096-3-Rodrigo.Siqueira@amd.com/),
	but it is not being used anywhere in the display driver.

2.	Also, according to the documentation, "The display/tests folder replicates
	the folder hierarchy of the display folder". However, note that this test file
	(test/kunit/dc/dml/calcs/bw_fixed_test.c) has a conflicting path with the file
	that is being tested (dc/basics/bw_fixed.c).

3.	Config Names and Helps are a bit misleading and don't follow a strict
	pattern. For example, the config DML_KUNIT_TEST indicates that it is used
	to activate tests for the Display Core Engine, but instead activates tests
	for the Display Core Next. Also, note the different name patterns in
	DML_KUNIT_TEST and AMD_DC_BASICS_KUNIT_TEST.

4.	The test suite dcn21_update_bw_bounding_box_test_suite configures an init
	function that doesn't need to be executed before every test, but only once
	before the suite runs.

5.	There are some not updated info in the Documentation, such as the
	recommended command to run the tests:
	$ ./tools/testing/kunit/kunit.py run --arch=x86_64 \
	--kunitconfig=drivers/gpu/drm/amd/display/tests
	(it doesn't work since there is no .kunitconfig in
	drivers/gpu/drm/amd/display/tests)


[HOW]

1. Revise Config names and Help blocks.

2.	Change the path of the test file bw_fixed_test from
	test/kunit/dc/dml/calcs/bw_fixed_test.c to test/kunit/dc/basics/bw_fixed_test.c
	to make it consistent with the Documentation and the other display driver
	tests. Make this same test file run by importing it conditionally in the file
	dc/basics/bw_fixed_test.c.

3.	Turn the test init function of the suite
	dcn21_update_bw_bounding_box_test_suite into a suite init.

4.	Update documentation
```

You can read the entire patch
[here](https://lore.kernel.org/amd-gfx/CAGVoLp5W0DT-RZbUvjoh6+=oNAi6A9V3P2syBMMVPXtiUY9K0A@mail.gmail.com/T/#u).

The way I sent the patch-set was kind of new to me; from what Marcelo Spessoto
told me, I had to send it as an answer to Siqueira repost, but, well, I had
never done that before. The fun part is: in the process, I discovered that KW
is actually smarter than I thought; if you run something like:

```bash
kw mail --send -4 -- --cover-letter --in-reply-to=20240222155811.44096-1-Rodrigo.Siqueira@amd.com
```

You will send the patch-set with the cover letter (and only the cover letter)
answering the email marked refered by `--in-reply-to`, which is just what I
wanted :D
Of course, I had to run some dry-runs before sending the real thing, but it
worked after all!

## Conclusion

Entering a Kernel community is a big challenge, and getting started with
something simple as tests may be a good path. There is a lot of things to
learn, and much more to do, but I'm really excited with all the evolution I've
had so far :)

[1] If you don't know Meirelles, he is truly
involved in helping FLUSP (FLOSS at USP) go back on track and has alredy
oriented some current Kernel contributors in the past, such as Rodrigo
Siqueira, Marcelo Schmitt and Magali Lemes. His help has been fenomenal! Also,
if you don't know FLUSP, you should definitly
[check it out](https://flusp.ime.usp.br/).

[2] Of course, there isn't only unit tests in Linux Kernel, but hey, I'm only
starting! (Hmmmm... maybe then I will post about IGT running integration tests?)
